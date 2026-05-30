export type ElectricityActivityItemDto = any;

export type ElectricityActivity = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string;
    reportingPeriodId: string;
    activityStartDate: string;
    activityEndDate: string;
    scopeType: string;
    electricityActivityType: string;
    sourceType: string;
    electricityKwh: number;
    electricityMwh: number;
    sourceFuelActivityId: string | null;
    supplierName: string | null;
    isRenewableCertified: boolean;
    dataQualityTier: string;
    estimationBasis: string | null;
    notes: string | null;
    workflowStatus: string;
    calculatedTCo2e: number;
    calculatedKgCo2e: number;
    documentsCount: number;
    factorSourceStandard?: string | null;
    factorSourceVersion?: string | null;
    factorSourceRegion?: string | null;
};
