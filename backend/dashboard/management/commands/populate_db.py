import datetime
from django.core.management.base import BaseCommand
from dashboard.models import (
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

class Command(BaseCommand):
    help = 'Populates the database with mock data'

    def handle(self, *args, **options):
        self.stdout.write('Populating database...')

        # Clean up existing data
        RiskOverview.objects.all().delete()
        CloudMisconfiguration.objects.all().delete()
        PackageVetting.objects.all().delete()
        PackageHealth.objects.all().delete()
        SecretsHygiene.objects.all().delete()
        IamRisk.objects.all().delete()
        SecurityAnomaly.objects.all().delete()
        ComplianceScore.objects.all().delete()
        ShadowIT.objects.all().delete()

        # Risk Overview
        RiskOverview.objects.create(total_issues=12, high_risk_roles=3, exposed_secrets=5)

        # Cloud Misconfigurations
        CloudMisconfiguration.objects.create(category='Public S3 Buckets', value=5)
        CloudMisconfiguration.objects.create(category='Open Ports', value=12)
        CloudMisconfiguration.objects.create(category='Admin IAM Roles', value=3)

        # Package Vetting
        PackageVetting.objects.create(repository='repo1', vulnerable_packages=2, license_violations=1)
        PackageVetting.objects.create(repository='repo2', vulnerable_packages=0, license_violations=3)
        PackageVetting.objects.create(repository='repo3', vulnerable_packages=5, license_violations=0)

        # Package Health
        PackageHealth.objects.create(label='Healthy', value=80)
        PackageHealth.objects.create(label='Vulnerable', value=15)
        PackageHealth.objects.create(label='At Risk', value=5)

        # Secrets Hygiene
        for i in range(10):
            date = datetime.date.today() - datetime.timedelta(days=i)
            SecretsHygiene.objects.create(date=date, secrets_found=10-i, secrets_rotated=i)

        # IAM Risk
        IamRisk.objects.create(role='admin', privileges='all', mfa_enabled=False)
        IamRisk.objects.create(role='developer', privileges='read-write', mfa_enabled=True)
        IamRisk.objects.create(role='guest', privileges='read-only', mfa_enabled=True)

        # Security Anomaly
        for i in range(10):
            date = datetime.date.today() - datetime.timedelta(days=i)
            SecurityAnomaly.objects.create(date=date, anomaly_type='impossible-travel', count=i)
            SecurityAnomaly.objects.create(date=date, anomaly_type='off-hours-access', count=10-i)

        # Compliance Score
        ComplianceScore.objects.create(owner='Team A', score=85)
        ComplianceScore.objects.create(owner='Team B', score=92)
        ComplianceScore.objects.create(owner='Team C', score=78)

        # Shadow IT
        ShadowIT.objects.create(item='Slack', detected_on=datetime.date.today())
        ShadowIT.objects.create(item='Trello', detected_on=datetime.date.today())

        self.stdout.write(self.style.SUCCESS('Successfully populated database.'))
