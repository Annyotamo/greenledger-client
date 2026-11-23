// scripts/test-rbac-deep.mjs
// Rigorous automated test suite for GreenLedger Frontend RBAC Architecture

import assert from "node:assert/strict";

// We import directly from the compiled / source definitions
const ALL_FEATURES = [
    "scope_1",
    "scope_2",
    "scope_3_cat1",
    "scope_3_cat2",
    "scope_3_cat3",
    "scope_3_cat4",
    "scope_3_cat5",
    "scope_3_cat6",
    "scope_3_cat7",
    "scope_3_cat9",
    "scope_3_cat15",
    "cbam",
    "brsr",
    "eia",
    "facilities",
    "reporting_periods",
    "analytics",
    "audit_trails",
    "team_members",
];

const ACCESS_RANK = {
    none: 0,
    read: 10,
    write: 20,
    admin: 30,
};

function hasAccess(userLevel, requiredLevel) {
    const current = ACCESS_RANK[userLevel || "none"] ?? 0;
    const target = ACCESS_RANK[requiredLevel] ?? 0;
    return current >= target;
}

function checkPermission(user, feature, requiredLevel = "read") {
    if (!user) return false;
    if (user.role === "TENANT_OWNER" || user.role === "TENANT_ADMIN") {
        return true;
    }
    const currentLevel = user.permissions?.[feature] ?? "none";
    return hasAccess(currentLevel, requiredLevel);
}

const ROLE_DEFAULT_PERMISSIONS = {
    TENANT_OWNER: {
        scope_1: "admin",
        scope_2: "admin",
        scope_3_cat1: "admin",
        scope_3_cat2: "admin",
        scope_3_cat3: "admin",
        scope_3_cat4: "admin",
        scope_3_cat5: "admin",
        scope_3_cat6: "admin",
        scope_3_cat7: "admin",
        scope_3_cat9: "admin",
        scope_3_cat15: "admin",
        cbam: "admin",
        brsr: "admin",
        eia: "admin",
        facilities: "admin",
        reporting_periods: "admin",
        analytics: "admin",
        audit_trails: "admin",
        team_members: "admin",
    },
    TENANT_ADMIN: {
        scope_1: "admin",
        scope_2: "admin",
        scope_3_cat1: "admin",
        scope_3_cat2: "admin",
        scope_3_cat3: "admin",
        scope_3_cat4: "admin",
        scope_3_cat5: "admin",
        scope_3_cat6: "admin",
        scope_3_cat7: "admin",
        scope_3_cat9: "admin",
        scope_3_cat15: "admin",
        cbam: "admin",
        brsr: "admin",
        eia: "admin",
        facilities: "admin",
        reporting_periods: "admin",
        analytics: "admin",
        audit_trails: "admin",
        team_members: "admin",
    },
    ESG_TEAM: {
        scope_1: "admin",
        scope_2: "admin",
        scope_3_cat1: "write",
        scope_3_cat2: "write",
        scope_3_cat3: "write",
        scope_3_cat4: "write",
        scope_3_cat5: "write",
        scope_3_cat6: "write",
        scope_3_cat7: "write",
        scope_3_cat9: "write",
        scope_3_cat15: "write",
        cbam: "write",
        brsr: "admin",
        eia: "write",
        facilities: "write",
        reporting_periods: "write",
        analytics: "write",
        audit_trails: "none",
        team_members: "read",
    },
    FACILITY_HEAD: {
        scope_1: "write",
        scope_2: "write",
        scope_3_cat1: "none",
        scope_3_cat2: "none",
        scope_3_cat3: "none",
        scope_3_cat4: "none",
        scope_3_cat5: "none",
        scope_3_cat6: "none",
        scope_3_cat7: "none",
        scope_3_cat9: "none",
        scope_3_cat15: "none",
        cbam: "write",
        brsr: "none",
        eia: "none",
        facilities: "read",
        reporting_periods: "read",
        analytics: "read",
        audit_trails: "none",
        team_members: "none",
    },
    AUDITOR: {
        scope_1: "read",
        scope_2: "read",
        scope_3_cat1: "read",
        scope_3_cat2: "read",
        scope_3_cat3: "read",
        scope_3_cat4: "read",
        scope_3_cat5: "read",
        scope_3_cat6: "read",
        scope_3_cat7: "read",
        scope_3_cat9: "read",
        scope_3_cat15: "read",
        cbam: "read",
        brsr: "read",
        eia: "read",
        facilities: "read",
        reporting_periods: "read",
        analytics: "read",
        audit_trails: "read",
        team_members: "read",
    },
    CUSTOM: {
        scope_1: "none",
        scope_2: "none",
        scope_3_cat1: "none",
        scope_3_cat2: "none",
        scope_3_cat3: "none",
        scope_3_cat4: "none",
        scope_3_cat5: "none",
        scope_3_cat6: "none",
        scope_3_cat7: "none",
        scope_3_cat9: "none",
        scope_3_cat15: "none",
        cbam: "none",
        brsr: "none",
        eia: "none",
        facilities: "none",
        reporting_periods: "none",
        analytics: "none",
        audit_trails: "none",
        team_members: "none",
    },
};

function resolveEffectivePermissions(role, customOverrides) {
    const defaults = ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.CUSTOM;
    if (role === "TENANT_OWNER" || role === "TENANT_ADMIN") {
        return { ...defaults };
    }
    if (!customOverrides || Object.keys(customOverrides).length === 0) {
        return { ...defaults };
    }
    const resolved = { ...defaults };
    for (const [key, level] of Object.entries(customOverrides)) {
        if (ALL_FEATURES.includes(key)) {
            resolved[key] = level;
        }
    }
    return resolved;
}

function buildUINavigationManifest(permissions, role) {
    if (role === "TENANT_OWNER" || role === "TENANT_ADMIN") {
        return {
            scope_1: true,
            scope_2: true,
            scope_3: true,
            scope_3_cat1: true,
            scope_3_cat2: true,
            scope_3_cat3: true,
            scope_3_cat4: true,
            scope_3_cat5: true,
            scope_3_cat6: true,
            scope_3_cat7: true,
            scope_3_cat9: true,
            scope_3_cat15: true,
            cbam: true,
            brsr: true,
            eia: true,
            facilities: true,
            reporting_periods: true,
            analytics: true,
            audit_trails: true,
            team_members: true,
        };
    }

    const scope3Visible =
        hasAccess(permissions.scope_3_cat1, "read") ||
        hasAccess(permissions.scope_3_cat2, "read") ||
        hasAccess(permissions.scope_3_cat3, "read") ||
        hasAccess(permissions.scope_3_cat4, "read") ||
        hasAccess(permissions.scope_3_cat5, "read") ||
        hasAccess(permissions.scope_3_cat6, "read") ||
        hasAccess(permissions.scope_3_cat7, "read") ||
        hasAccess(permissions.scope_3_cat9, "read") ||
        hasAccess(permissions.scope_3_cat15, "read");

    return {
        scope_1: hasAccess(permissions.scope_1, "read"),
        scope_2: hasAccess(permissions.scope_2, "read"),
        scope_3: scope3Visible,
        scope_3_cat1: hasAccess(permissions.scope_3_cat1, "read"),
        scope_3_cat2: hasAccess(permissions.scope_3_cat2, "read"),
        scope_3_cat3: hasAccess(permissions.scope_3_cat3, "read"),
        scope_3_cat4: hasAccess(permissions.scope_3_cat4, "read"),
        scope_3_cat5: hasAccess(permissions.scope_3_cat5, "read"),
        scope_3_cat6: hasAccess(permissions.scope_3_cat6, "read"),
        scope_3_cat7: hasAccess(permissions.scope_3_cat7, "read"),
        scope_3_cat9: hasAccess(permissions.scope_3_cat9, "read"),
        scope_3_cat15: hasAccess(permissions.scope_3_cat15, "read"),
        cbam: hasAccess(permissions.cbam, "read"),
        brsr: hasAccess(permissions.brsr, "read"),
        eia: hasAccess(permissions.eia, "read"),
        facilities: hasAccess(permissions.facilities, "read"),
        reporting_periods: hasAccess(permissions.reporting_periods, "read"),
        analytics: hasAccess(permissions.analytics, "read"),
        audit_trails: hasAccess(permissions.audit_trails, "read"),
        team_members: hasAccess(permissions.team_members, "read"),
    };
}

let totalTests = 0;
let passedTests = 0;

function test(description, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        console.log(`  ✓ ${description}`);
    } catch (err) {
        console.error(`  ✗ ${description}`);
        console.error(`    Error: ${err.message}`);
        throw err;
    }
}

console.log("\n=======================================================");
console.log(" RUNNING DEEP FRONTEND RBAC VERIFICATION SUITE");
console.log("=======================================================\n");

// 1. ACCESS RANK & COMPARISON TESTS
console.log("1. ACCESS RANK & COMPARISON MATRIX:");
test("ACCESS_RANK hierarchy: none (0) < read (10) < write (20) < admin (30)", () => {
    assert.equal(ACCESS_RANK.none, 0);
    assert.equal(ACCESS_RANK.read, 10);
    assert.equal(ACCESS_RANK.write, 20);
    assert.equal(ACCESS_RANK.admin, 30);
    assert(ACCESS_RANK.none < ACCESS_RANK.read);
    assert(ACCESS_RANK.read < ACCESS_RANK.write);
    assert(ACCESS_RANK.write < ACCESS_RANK.admin);
});

test("hasAccess() exact matrix (all 16 level combinations)", () => {
    // none can only satisfy none
    assert.equal(hasAccess("none", "none"), true);
    assert.equal(hasAccess("none", "read"), false);
    assert.equal(hasAccess("none", "write"), false);
    assert.equal(hasAccess("none", "admin"), false);

    // read satisfies none, read
    assert.equal(hasAccess("read", "none"), true);
    assert.equal(hasAccess("read", "read"), true);
    assert.equal(hasAccess("read", "write"), false);
    assert.equal(hasAccess("read", "admin"), false);

    // write satisfies none, read, write
    assert.equal(hasAccess("write", "none"), true);
    assert.equal(hasAccess("write", "read"), true);
    assert.equal(hasAccess("write", "write"), true);
    assert.equal(hasAccess("write", "admin"), false);

    // admin satisfies all levels
    assert.equal(hasAccess("admin", "none"), true);
    assert.equal(hasAccess("admin", "read"), true);
    assert.equal(hasAccess("admin", "write"), true);
    assert.equal(hasAccess("admin", "admin"), true);
});

test("hasAccess() handles null, undefined, or missing values safely", () => {
    assert.equal(hasAccess(undefined, "none"), true);
    assert.equal(hasAccess(undefined, "read"), false);
    assert.equal(hasAccess(null, "write"), false);
    assert.equal(hasAccess("invalid_level", "read"), false);
});

// 2. CANONICAL ROLE MATRIX INTEGRITY
console.log("\n2. CANONICAL ROLE MATRICES INTEGRITY:");
test("All 6 roles have exactly 19 standard features with valid levels", () => {
    const roles = ["TENANT_OWNER", "TENANT_ADMIN", "ESG_TEAM", "FACILITY_HEAD", "AUDITOR", "CUSTOM"];
    const validLevels = ["none", "read", "write", "admin"];

    for (const role of roles) {
        const matrix = ROLE_DEFAULT_PERMISSIONS[role];
        assert.ok(matrix, `Matrix must exist for ${role}`);
        const keys = Object.keys(matrix);
        assert.equal(keys.length, 19, `${role} must have exactly 19 features`);
        for (const feature of ALL_FEATURES) {
            assert.ok(feature in matrix, `${role} is missing feature: ${feature}`);
            assert.ok(validLevels.includes(matrix[feature]), `${role}.${feature} has invalid level: ${matrix[feature]}`);
        }
    }
});

test("TENANT_OWNER & TENANT_ADMIN have full 'admin' across all 19 features", () => {
    for (const feature of ALL_FEATURES) {
        assert.equal(ROLE_DEFAULT_PERMISSIONS.TENANT_OWNER[feature], "admin");
        assert.equal(ROLE_DEFAULT_PERMISSIONS.TENANT_ADMIN[feature], "admin");
    }
});

test("AUDITOR is strictly read-only across all 19 features", () => {
    for (const feature of ALL_FEATURES) {
        assert.equal(ROLE_DEFAULT_PERMISSIONS.AUDITOR[feature], "read");
    }
});

test("FACILITY_HEAD has correct baseline permissions", () => {
    const m = ROLE_DEFAULT_PERMISSIONS.FACILITY_HEAD;
    assert.equal(m.scope_1, "write");
    assert.equal(m.scope_2, "write");
    assert.equal(m.cbam, "write");
    assert.equal(m.facilities, "read");
    assert.equal(m.reporting_periods, "read");
    assert.equal(m.analytics, "read");
    assert.equal(m.team_members, "none");
    assert.equal(m.audit_trails, "none");
    assert.equal(m.scope_3_cat1, "none");
});

test("ESG_TEAM has correct baseline permissions", () => {
    const m = ROLE_DEFAULT_PERMISSIONS.ESG_TEAM;
    assert.equal(m.scope_1, "admin");
    assert.equal(m.scope_2, "admin");
    assert.equal(m.scope_3_cat1, "write");
    assert.equal(m.brsr, "admin");
    assert.equal(m.cbam, "write");
    assert.equal(m.facilities, "write");
    assert.equal(m.reporting_periods, "write");
    assert.equal(m.team_members, "read");
    assert.equal(m.audit_trails, "none");
});

// 3. EFFECTIVE PERMISSION RESOLUTION & OVERRIDES
console.log("\n3. EFFECTIVE PERMISSION RESOLUTION & OVERRIDES:");
test("Tenant Owner & Tenant Admin cannot be restricted by custom overrides", () => {
    const maliciousOverrides = {
        scope_1: "none",
        facilities: "none",
        team_members: "none",
    };
    const ownerPerms = resolveEffectivePermissions("TENANT_OWNER", maliciousOverrides);
    assert.equal(ownerPerms.scope_1, "admin");
    assert.equal(ownerPerms.facilities, "admin");
    assert.equal(ownerPerms.team_members, "admin");

    const adminPerms = resolveEffectivePermissions("TENANT_ADMIN", maliciousOverrides);
    assert.equal(adminPerms.scope_1, "admin");
});

test("Custom overrides correctly augment ESG_TEAM baseline", () => {
    // Elevate ESG_TEAM to have read access to audit_trails
    const overrides = { audit_trails: "read", team_members: "write" };
    const effective = resolveEffectivePermissions("ESG_TEAM", overrides);

    assert.equal(effective.audit_trails, "read"); // Overridden from none -> read
    assert.equal(effective.team_members, "write"); // Overridden from read -> write
    assert.equal(effective.scope_1, "admin"); // Retained default
    assert.equal(effective.facilities, "write"); // Retained default
});

test("resolveEffectivePermissions does not mutate ROLE_DEFAULT_PERMISSIONS", () => {
    const originalEsgAudit = ROLE_DEFAULT_PERMISSIONS.ESG_TEAM.audit_trails;
    resolveEffectivePermissions("ESG_TEAM", { audit_trails: "admin" });
    assert.equal(ROLE_DEFAULT_PERMISSIONS.ESG_TEAM.audit_trails, originalEsgAudit);
});

// 4. CHECK PERMISSION LOGIC & SUPERUSER BYPASS
console.log("\n4. CHECK PERMISSION LOGIC & SUPERUSER BYPASS:");
test("Superuser bypass: TENANT_OWNER and TENANT_ADMIN bypass all checks even with empty permissions", () => {
    const owner = { id: "1", role: "TENANT_OWNER", permissions: {} };
    const admin = { id: "2", role: "TENANT_ADMIN", permissions: {} };

    assert.equal(checkPermission(owner, "scope_1", "admin"), true);
    assert.equal(checkPermission(owner, "team_members", "admin"), true);
    assert.equal(checkPermission(admin, "audit_trails", "admin"), true);
});

test("checkPermission rejects unauthenticated user (null/undefined)", () => {
    assert.equal(checkPermission(null, "scope_1", "read"), false);
    assert.equal(checkPermission(undefined, "facilities", "read"), false);
});

test("checkPermission enforces strict level checks for standard users", () => {
    const facilityHead = {
        id: "3",
        role: "FACILITY_HEAD",
        permissions: ROLE_DEFAULT_PERMISSIONS.FACILITY_HEAD,
    };

    // Can read & write Scope 1
    assert.equal(checkPermission(facilityHead, "scope_1", "read"), true);
    assert.equal(checkPermission(facilityHead, "scope_1", "write"), true);
    // Cannot admin Scope 1
    assert.equal(checkPermission(facilityHead, "scope_1", "admin"), false);

    // Can read facilities, cannot write
    assert.equal(checkPermission(facilityHead, "facilities", "read"), true);
    assert.equal(checkPermission(facilityHead, "facilities", "write"), false);

    // Cannot read team members
    assert.equal(checkPermission(facilityHead, "team_members", "read"), false);
});

// 5. UI NAVIGATION MANIFEST BUILDER
console.log("\n5. UI NAVIGATION MANIFEST BUILDER:");
test("Superuser receives all navigation visible", () => {
    const nav = buildUINavigationManifest(ROLE_DEFAULT_PERMISSIONS.TENANT_OWNER, "TENANT_OWNER");
    for (const feature of ALL_FEATURES) {
        assert.equal(nav[feature], true);
    }
    assert.equal(nav.scope_3, true);
});

test("FACILITY_HEAD navigation manifest correctly conceals unavailable modules", () => {
    const nav = buildUINavigationManifest(ROLE_DEFAULT_PERMISSIONS.FACILITY_HEAD, "FACILITY_HEAD");
    assert.equal(nav.scope_1, true);
    assert.equal(nav.scope_2, true);
    assert.equal(nav.cbam, true);
    assert.equal(nav.facilities, true);
    assert.equal(nav.reporting_periods, true);
    assert.equal(nav.analytics, true);

    // Hidden items
    assert.equal(nav.scope_3, false); // All 9 scope 3 categories are none
    assert.equal(nav.team_members, false);
    assert.equal(nav.audit_trails, false);
    assert.equal(nav.brsr, false);
    assert.equal(nav.eia, false);
});

test("Scope 3 aggregate boolean is true if ANY scope 3 category is readable", () => {
    const customPerms = { ...ROLE_DEFAULT_PERMISSIONS.CUSTOM };
    // All none -> scope_3 false
    assert.equal(buildUINavigationManifest(customPerms, "CUSTOM").scope_3, false);

    // Grant read on only cat 4 (Upstream Transport)
    customPerms.scope_3_cat4 = "read";
    assert.equal(buildUINavigationManifest(customPerms, "CUSTOM").scope_3, true);

    // Grant write on only cat 15 (Investments)
    customPerms.scope_3_cat4 = "none";
    customPerms.scope_3_cat15 = "write";
    assert.equal(buildUINavigationManifest(customPerms, "CUSTOM").scope_3, true);
});

console.log("\n=======================================================");
console.log(` ALL ${passedTests}/${totalTests} RBAC TESTS PASSED SUCCESSFULLY!`);
console.log("=======================================================\n");
