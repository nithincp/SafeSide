from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RiskOverviewViewSet,
    CloudMisconfigurationViewSet,
    PackageVettingViewSet,
    PackageHealthViewSet,
    SecretsHygieneViewSet,
    IamRiskViewSet,
    SecurityAnomalyViewSet,
    ComplianceScoreViewSet,
    ShadowITViewSet,
)

router = DefaultRouter()
router.register(r'risk-overview', RiskOverviewViewSet)
router.register(r'cloud-misconfigurations', CloudMisconfigurationViewSet)
router.register(r'package-vetting', PackageVettingViewSet)
router.register(r'package-health', PackageHealthViewSet)
router.register(r'secrets-hygiene', SecretsHygieneViewSet)
router.register(r'iam-risk-analyzer', IamRiskViewSet)
router.register(r'security-anomalies', SecurityAnomalyViewSet)
router.register(r'compliance-score', ComplianceScoreViewSet)
router.register(r'shadow-it', ShadowITViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
