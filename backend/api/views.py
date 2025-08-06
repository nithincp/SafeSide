import requests
from packaging import version as pkg_version
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

# Set up logging
logger = logging.getLogger(__name__)

class CVECheckView(APIView):

    def post(self, request):
        try:
            print("Received request")
            print(request.data)
            data = request.data
            library = data.get('library')
            version = data.get('version')
            ecosystem = data.get('ecosystem')

            print(library, version, ecosystem)
            if not all([library, version, ecosystem]):
                return Response({"error": "library, version, and ecosystem are required"},
                                status=status.HTTP_400_BAD_REQUEST)

            ecosystem_map = {
                "python": "PyPI",
                "java": "Maven",
                "npm": "npm",
                "dotnet": "NuGet",
            }

            osv_ecosystem = ecosystem_map.get(ecosystem.lower())
            if not osv_ecosystem:
                return Response(
                    {"error": f"Ecosystem '{ecosystem}' not supported. Supported: python, java, npm, dotnet"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payload = {
                "package": {
                    "name": library,
                    "ecosystem": osv_ecosystem
                },
                "version": version
            }

            try:
                response = requests.post("https://api.osv.dev/v1/query", json=payload, timeout=30)
                response.raise_for_status()  # Raises an HTTPError for bad responses (4xx, 5xx)
            except requests.exceptions.Timeout:
                logger.error(f"Timeout error when querying OSV API for {library} {version}")
                return Response(
                    {"error": "Request timeout. The OSV API is taking too long to respond. Please try again later."},
                    status=status.HTTP_504_GATEWAY_TIMEOUT
                )
            except requests.exceptions.ConnectionError:
                logger.error(f"Connection error when querying OSV API for {library} {version}")
                return Response(
                    {"error": "Connection error. Unable to reach the OSV API. Please check your internet connection and try again."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            except requests.exceptions.HTTPError as e:
                logger.error(f"HTTP error when querying OSV API: {e}")
                return Response(
                    {"error": f"OSV API error: {str(e)}"},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            except requests.exceptions.RequestException as e:
                logger.error(f"Request error when querying OSV API: {e}")
                return Response(
                    {"error": "Failed to communicate with OSV API. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                data = response.json()
            except ValueError as e:
                logger.error(f"JSON parsing error from OSV API response: {e}")
                return Response(
                    {"error": "Invalid response from OSV API. Please try again later."},
                    status=status.HTTP_502_BAD_GATEWAY
                )

            vulns = data.get('vulns', [])

            if not vulns:
                return Response({"message": f"No CVEs found for {library} version {version} in {ecosystem}"})

            results = []
            fixed_versions = []

            try:
                for vuln in vulns:
                    # Filter only vulnerabilities with a CVE ID
                    cve_id = None
                    for alias in vuln.get('aliases', []):
                        if alias.startswith('CVE-'):
                            cve_id = alias
                            break

                    if not cve_id:
                        continue  # Skip non-CVE vulnerabilities

                    results.append({
                        "id": cve_id,
                        "summary": vuln.get('summary'),
                        "details": vuln.get('details'),
                        "references": vuln.get('references')
                    })

                    affected = vuln.get('affected', [])
                    for aff in affected:
                        for range_ in aff.get('ranges', []):
                            fixed_version = range_.get('fixed')
                            if fixed_version:
                                try:
                                    if pkg_version.parse(fixed_version) > pkg_version.parse(version):
                                        fixed_versions.append(fixed_version)
                                except pkg_version.InvalidVersion as e:
                                    logger.warning(f"Invalid version format: {fixed_version} - {e}")
                                    continue
                                except Exception as e:
                                    logger.warning(f"Error parsing version {fixed_version}: {e}")
                                    continue

            except Exception as e:
                logger.error(f"Error processing vulnerability data: {e}")
                return Response(
                    {"error": "Error processing vulnerability data. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            if not results:
                return Response({"message": f"No CVEs found for {library} version {version} in {ecosystem}"})

            try:
                if fixed_versions:
                    suggested_version = sorted(fixed_versions, key=pkg_version.parse)[0]
                    return Response({
                        "cves": results,
                        "suggested_non_vulnerable_version": suggested_version,
                        "message": f"Upgrade to version {suggested_version} or later to avoid these vulnerabilities."
                    })

                return Response({
                    "cves": results,
                    "message": "No fixed version found. Please check vulnerability details for mitigation."
                })
            except Exception as e:
                logger.error(f"Error sorting fixed versions: {e}")
                return Response({
                    "cves": results,
                    "message": "Vulnerabilities found. Please check details for mitigation."
                })

        except Exception as e:
            logger.error(f"Unexpected error in CVECheckView: {e}")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )