from rest_framework import viewsets
from .models import (
    RiskOverview,
    CloudMisconfiguration,
    PackageVetting,
    PackageHealth,
    SecretsHygiene,
    IamRisk,
    SecurityAnomaly,
    ComplianceScore,
    ShadowIT,
)
from .serializers import (
    RiskOverviewSerializer,
    CloudMisconfigurationSerializer,
    PackageVettingSerializer,
    PackageHealthSerializer,
    SecretsHygieneSerializer,
    IamRiskSerializer,
    SecurityAnomalySerializer,
    ComplianceScoreSerializer,
    ShadowITSerializer,
)

class RiskOverviewViewSet(viewsets.ModelViewSet):
    queryset = RiskOverview.objects.all()
    serializer_class = RiskOverviewSerializer

class CloudMisconfigurationViewSet(viewsets.ModelViewSet):
    queryset = CloudMisconfiguration.objects.all()
    serializer_class = CloudMisconfigurationSerializer

class PackageVettingViewSet(viewsets.ModelViewSet):
    queryset = PackageVetting.objects.all()
    serializer_class = PackageVettingSerializer

class PackageHealthViewSet(viewsets.ModelViewSet):
    queryset = PackageHealth.objects.all()
    serializer_class = PackageHealthSerializer

class SecretsHygieneViewSet(viewsets.ModelViewSet):
    queryset = SecretsHygiene.objects.all()
    serializer_class = SecretsHygieneSerializer

class IamRiskViewSet(viewsets.ModelViewSet):
    queryset = IamRisk.objects.all()
    serializer_class = IamRiskSerializer

class SecurityAnomalyViewSet(viewsets.ModelViewSet):
    queryset = SecurityAnomaly.objects.all()
    serializer_class = SecurityAnomalySerializer

class ComplianceScoreViewSet(viewsets.ModelViewSet):
    queryset = ComplianceScore.objects.all()
    serializer_class = ComplianceScoreSerializer

class ShadowITViewSet(viewsets.ModelViewSet):
    queryset = ShadowIT.objects.all()
    serializer_class = ShadowITSerializer
