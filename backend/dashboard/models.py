from django.db import models

class RiskOverview(models.Model):
    total_issues = models.IntegerField()
    high_risk_roles = models.IntegerField()
    exposed_secrets = models.IntegerField()

class CloudMisconfiguration(models.Model):
    category = models.CharField(max_length=100)
    value = models.IntegerField()

class PackageVetting(models.Model):
    repository = models.CharField(max_length=100)
    vulnerable_packages = models.IntegerField()
    license_violations = models.IntegerField()

class PackageHealth(models.Model):
    label = models.CharField(max_length=100)
    value = models.IntegerField()

class SecretsHygiene(models.Model):
    date = models.DateField()
    secrets_found = models.IntegerField()
    secrets_rotated = models.IntegerField()

class IamRisk(models.Model):
    role = models.CharField(max_length=100)
    privileges = models.CharField(max_length=100)
    mfa_enabled = models.BooleanField()

class SecurityAnomaly(models.Model):
    date = models.DateField()
    anomaly_type = models.CharField(max_length=100)
    count = models.IntegerField()

class ComplianceScore(models.Model):
    owner = models.CharField(max_length=100)
    score = models.IntegerField()

class ShadowIT(models.Model):
    item = models.CharField(max_length=100)
    detected_on = models.DateField()
