from rest_framework import serializers
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

class RiskOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskOverview
        fields = '__all__'

class CloudMisconfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudMisconfiguration
        fields = '__all__'

class PackageVettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageVetting
        fields = '__all__'

class PackageHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageHealth
        fields = '__all__'

class SecretsHygieneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecretsHygiene
        fields = '__all__'

class IamRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = IamRisk
        fields = '__all__'

class SecurityAnomalySerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityAnomaly
        fields = '__all__'

class ComplianceScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceScore
        fields = '__all__'

class ShadowITSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShadowIT
        fields = '__all__'
