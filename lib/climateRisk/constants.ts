// Fixed choices for the Risk Assessment screens.

/** Reporting years offered when creating or editing an assessment: this year and the three before it. */
const THIS_YEAR = new Date().getFullYear();
export const REPORTING_YEARS = [THIS_YEAR, THIS_YEAR - 1, THIS_YEAR - 2, THIS_YEAR - 3];

/** SASB industries the spec allows on the company (server validates the same list). */
export const SASB_OPTIONS = [
    { code: "EM-IS", name: "Iron and Steel Producers" },
    { code: "EM-CM", name: "Construction Materials" },
    { code: "EM-MM", name: "Metals and Mining" },
];
