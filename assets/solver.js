export class ContradictionError extends Error {
    constructor(message, conflicts) {
        super(message);
        this.name = 'ContradictionError';
        this.conflicts = conflicts;
    }
}

class Constraint {
    constructor(variables, evaluate) {
        this.variables = variables;
        this.evaluate = evaluate;
    }
}

// Conflict resolution helper for 3-variable constraints
function resolveConflict3(a, b, c, getC, getA, getB, vars, solver, errorMsg, conflicts) {
    let statA = solver ? solver.status[a] : 'user';
    let statB = solver ? solver.status[b] : 'user';
    let statC = solver ? solver.status[c] : 'user';

    let lockedCount = 0;
    if (statA === 'locked') lockedCount++;
    if (statB === 'locked') lockedCount++;
    if (statC === 'locked') lockedCount++;

    let userCount = 0;
    if (statA === 'user') userCount++;
    if (statB === 'user') userCount++;
    if (statC === 'user') userCount++;

    // If 0 variables are locked and all 3 are explicit user inputs, or if all 3 are locked -> Contradiction!
    if ((lockedCount === 0 && userCount === 3) || lockedCount === 3) {
        throw new ContradictionError(errorMsg, conflicts);
    }

    // 1. Prefer overriding calculated ('calc'/'auto-calc') variables first —
    //    nobody explicitly asserted these, so silently recomputing them is safe.
    if (statC === 'calc' || statC === 'auto-calc') {
        let valC = getC();
        if (valC !== undefined && !isNaN(valC)) return [{ name: c, value: valC, override: true }];
    }
    if (statA === 'calc' || statA === 'auto-calc') {
        let valA = getA();
        if (valA !== undefined && !isNaN(valA)) return [{ name: a, value: valA, override: true }];
    }
    if (statB === 'calc' || statB === 'auto-calc') {
        let valB = getB();
        if (valB !== undefined && !isNaN(valB)) return [{ name: b, value: valB, override: true }];
    }

    // 2. Nothing left that's safe to silently discard: whatever remains is
    //    either locked or something a person just typed. If a lock and a
    //    freshly-typed value disagree, that's a real contradiction — say so,
    //    instead of quietly overwriting what the person just entered.
    if (lockedCount > 0 && userCount > 0) {
        throw new ContradictionError(errorMsg, conflicts);
    }

    // 3. Fallback for the remaining case (no lock involved at all).
    if (statA !== 'locked') {
        let valA = getA();
        if (valA !== undefined && !isNaN(valA)) return [{ name: a, value: valA, override: true }];
    }
    if (statB !== 'locked') {
        let valB = getB();
        if (valB !== undefined && !isNaN(valB)) return [{ name: b, value: valB, override: true }];
    }
    if (statC !== 'locked') {
        let valC = getC();
        if (valC !== undefined && !isNaN(valC)) return [{ name: c, value: valC, override: true }];
    }

    throw new ContradictionError(errorMsg, conflicts);
}

// Conflict resolution helper for 2-variable constraints
function resolveConflict2(a, b, getB, getA, vars, solver, errorMsg, conflicts) {
    let statA = solver ? solver.status[a] : 'user';
    let statB = solver ? solver.status[b] : 'user';

    let lockedCount = 0;
    if (statA === 'locked') lockedCount++;
    if (statB === 'locked') lockedCount++;

    let userCount = 0;
    if (statA === 'user') userCount++;
    if (statB === 'user') userCount++;

    if ((lockedCount === 0 && userCount === 2) || lockedCount === 2) {
        throw new ContradictionError(errorMsg, conflicts);
    }

    // 1. Prefer overriding calculated ('calc'/'auto-calc') variables first —
    //    nobody explicitly asserted these, so silently recomputing them is safe.
    if (statB === 'calc' || statB === 'auto-calc') {
        let valB = getB();
        if (valB !== undefined && !isNaN(valB)) return [{ name: b, value: valB, override: true }];
    }
    if (statA === 'calc' || statA === 'auto-calc') {
        let valA = getA();
        if (valA !== undefined && !isNaN(valA)) return [{ name: a, value: valA, override: true }];
    }

    // 2. A lock and a freshly-typed value disagree — real contradiction,
    //    don't quietly overwrite what the person just entered.
    if (lockedCount > 0 && userCount > 0) {
        throw new ContradictionError(errorMsg, conflicts);
    }

    // 3. Fallback for the remaining case (no lock involved at all).
    if (statB !== 'locked') {
        let valB = getB();
        if (valB !== undefined && !isNaN(valB)) return [{ name: b, value: valB, override: true }];
    }
    if (statA !== 'locked') {
        let valA = getA();
        if (valA !== undefined && !isNaN(valA)) return [{ name: a, value: valA, override: true }];
    }

    throw new ContradictionError(errorMsg, conflicts);
}

// Умножение: a * b = c
function mult(a, b, c) {
    return new Constraint([a, b, c], (vars, solver) => {
        let vA = vars[a], vB = vars[b], vC = vars[c];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        if (vC === undefined) missing.push(c);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === c) return [{ name: c, value: vA * vB }];
            if (target === a && vB !== 0) return [{ name: a, value: vC / vB }];
            if (target === b && vA !== 0) return [{ name: b, value: vC / vA }];
        } else if (missing.length === 0) {
            if (Math.abs((vA * vB) - vC) > 1e-4) {
                return resolveConflict3(
                    a, b, c,
                    () => vA * vB,
                    () => vB !== 0 ? vC / vB : undefined,
                    () => vA !== 0 ? vC / vA : undefined,
                    vars, solver,
                    `These can't all be true: ${a} × ${b} must equal ${c}. Unlock one of them, or change a value.`, [a, b, c]
                );
            }
        }
        return [];
    });
}

// Вычитание: a - b = c
function sub(a, b, c) {
    return new Constraint([a, b, c], (vars, solver) => {
        let vA = vars[a], vB = vars[b], vC = vars[c];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        if (vC === undefined) missing.push(c);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === c) return [{ name: c, value: vA - vB }];
            if (target === a) return [{ name: a, value: vC + vB }];
            if (target === b) return [{ name: b, value: vA - vC }];
        } else if (missing.length === 0) {
            if (Math.abs((vA - vB) - vC) > 1e-4) {
                return resolveConflict3(
                    a, b, c,
                    () => vA - vB,
                    () => vC + vB,
                    () => vA - vC,
                    vars, solver,
                    `These can't all be true: ${a} minus ${b} must equal ${c}. Unlock one of them, or change a value.`, [a, b, c]
                );
            }
        }
        return [];
    });
}

// Умножение с масштабом (например, для CPM): a * b / scale = c
function multScale(a, b, c, scale) {
    return new Constraint([a, b, c], (vars, solver) => {
        let vA = vars[a], vB = vars[b], vC = vars[c];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        if (vC === undefined) missing.push(c);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === c) return [{ name: c, value: (vA * vB) / scale }];
            if (target === a && vB !== 0) return [{ name: a, value: (vC * scale) / vB }];
            if (target === b && vA !== 0) return [{ name: b, value: (vC * scale) / vA }];
        } else if (missing.length === 0) {
            if (Math.abs(((vA * vB) / scale) - vC) > 1e-4) {
                return resolveConflict3(
                    a, b, c,
                    () => (vA * vB) / scale,
                    () => vB !== 0 ? (vC * scale) / vB : undefined,
                    () => vA !== 0 ? (vC * scale) / vA : undefined,
                    vars, solver,
                    `These can't all be true: ${a} and ${b} don't match ${c}. Unlock one of them, or change a value.`, [a, b, c]
                );
            }
        }
        return [];
    });
}

// Умножение на константу: a * constant = b
function multConst(a, constant, b) {
    return new Constraint([a, b], (vars, solver) => {
        let vA = vars[a], vB = vars[b];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === b) return [{ name: b, value: vA * constant }];
            if (target === a && constant !== 0) return [{ name: a, value: vB / constant }];
        } else if (missing.length === 0) {
            if (Math.abs((vA * constant) - vB) > 1e-4) {
                return resolveConflict2(
                    a, b,
                    () => vA * constant,
                    () => constant !== 0 ? vB / constant : undefined,
                    vars, solver,
                    `These can't both be true: ${a} × ${constant} must equal ${b}. Unlock one of them, or change a value.`, [a, b]
                );
            }
        }
        return [];
    });
}

// Вычитание константы: a - constant = b
function subConst(a, constant, b) {
    return new Constraint([a, b], (vars, solver) => {
        let vA = vars[a], vB = vars[b];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === b) return [{ name: b, value: vA - constant }];
            if (target === a) return [{ name: a, value: vB + constant }];
        } else if (missing.length === 0) {
            if (Math.abs((vA - constant) - vB) > 1e-4) {
                return resolveConflict2(
                    a, b,
                    () => vA - constant,
                    () => vB + constant,
                    vars, solver,
                    `These can't both be true: ${a} minus ${constant} must equal ${b}. Unlock one of them, or change a value.`, [a, b]
                );
            }
        }
        return [];
    });
}

// Равенство: a = b
function equal(a, b) {
    return new Constraint([a, b], (vars, solver) => {
        let vA = vars[a], vB = vars[b];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === a) return [{ name: a, value: vB }];
            if (target === b) return [{ name: b, value: vA }];
        } else if (missing.length === 0) {
            if (Math.abs(vA - vB) > 1e-4) {
                return resolveConflict2(
                    a, b,
                    () => vB,
                    () => vA,
                    vars, solver,
                    `${a} and ${b} are the same thing in this calculator, so they must match. Unlock one of them, or change a value.`, [a, b]
                );
            }
        }
        return [];
    });
}

// Взаимно обратные величины: a * b = 1
function reciprocal(a, b) {
    return new Constraint([a, b], (vars, solver) => {
        let vA = vars[a], vB = vars[b];
        let missing = [];
        if (vA === undefined) missing.push(a);
        if (vB === undefined) missing.push(b);
        
        if (missing.length === 1) {
            let target = missing[0];
            if (target === a && vB !== 0) return [{ name: a, value: 1 / vB }];
            if (target === b && vA !== 0) return [{ name: b, value: 1 / vA }];
        } else if (missing.length === 0) {
            if (Math.abs((vA * vB) - 1) > 1e-4) {
                return resolveConflict2(
                    a, b,
                    () => vA !== 0 ? 1 / vA : undefined,
                    () => vB !== 0 ? 1 / vB : undefined,
                    vars, solver,
                    `${a} and ${b} are inverses of each other, so one must equal 1 divided by the other. Unlock one of them, or change a value.`, [a, b]
                );
            }
        }
        return [];
    });
}

export class FunnelSolver {
    constructor() {
        this.clear();
        this.initConstraints();
    }

    clear() {
        this.vars = {}; // { name: value }
        this.status = {}; // { name: 'user' | 'calc' }
    }

    initConstraints() {
        this.constraints = [
            // --- Трафик & Видео ---
            mult('reach', 'frequency', 'impressions'),
            mult('impressions', 'ctr', 'clicks'),
            multScale('impressions', 'cpm', 'ad_spend', 1000),
            mult('clicks', 'cpc', 'ad_spend'),
            mult('impressions', 'vtr', 'views'),
            mult('views', 'cpv', 'ad_spend'),
            multScale('cpc', 'ctr', 'cpm', 0.001),           // CPC * CTR * 1000 = CPM
            
            // --- Вовлеченность & Инсталлы ---
            mult('impressions', 'er', 'engagements'),
            mult('engagements', 'cpe', 'ad_spend'),
            mult('installs', 'cpi', 'ad_spend'),
            
            // --- Лидогенерация (B2B) ---
            mult('clicks', 'cvr_lead', 'leads'),
            mult('leads', 'cpl', 'ad_spend'),
            mult('leads', 'cvr_mql', 'mqls'),
            mult('mqls', 'cost_per_mql', 'ad_spend'),
            mult('mqls', 'cvr_sql', 'sqls'),
            mult('sqls', 'cost_per_sql', 'ad_spend'),
            mult('leads', 'close_rate', 'purchases'),
            mult('cpl', 'cvr_lead', 'cpc'),                 // CPL * CVR_Lead = CPC
            mult('cpa', 'close_rate', 'cpl'),               // CPA * Close_Rate = CPL
            mult('cost_per_mql', 'cvr_mql', 'cpl'),         // Cost_Per_MQL * CVR_MQL = CPL
            mult('cost_per_sql', 'cvr_sql', 'cost_per_mql'), // Cost_Per_SQL * CVR_SQL = Cost_Per_MQL
            
            // Микроворонка (Target Actions -> Leads)
            mult('clicks', 'cvr_action', 'target_actions'),
            mult('target_actions', 'cost_per_action', 'ad_spend'),
            mult('cost_per_action', 'cvr_action', 'cpc'),    // Cost_Per_Action * CVR_Action = CPC
            mult('target_actions', 'cvr_action_to_lead', 'leads'),
            mult('cvr_action', 'cvr_action_to_lead', 'cvr_lead'),
            mult('cpl', 'cvr_action_to_lead', 'cost_per_action'),
            
            // --- E-Commerce ---
            mult('purchases', 'cpo', 'ad_spend'),
            mult('purchases', 'aov', 'revenue'),
            mult('ad_spend', 'roas', 'revenue'),
            mult('ad_spend', 'mer', 'revenue'),
            mult('revenue', 'drr', 'ad_spend'),             // DRR (Доля рекламных расходов)
            reciprocal('roas', 'drr'),                       // Прямая связь ROAS <=> DRR (1 / ROAS = DRR)
            mult('clicks', 'atc_rate', 'atc'),
            mult('clicks', 'checkout_rate', 'checkout'),
            mult('cpo', 'cvr', 'cpc'),                      // CPO * CVR = CPC
            
            // --- Связи и конверсии ---
            mult('clicks', 'cvr', 'purchases'),            // Прямая конверсия клик -> покупка
            mult('cvr_lead', 'close_rate', 'cvr'),          // Связь B2B-конверсий с общей конверсией (cvr = cvr_lead * close_rate)
            
            // --- SaaS ---
            mult('clicks', 'cvr_signup', 'signups'),
            mult('signups', 'cps', 'ad_spend'),
            mult('signups', 'cvr_trial', 'trials'),
            mult('trials', 'cpt', 'ad_spend'),
            mult('trials', 'cvr_trial_purchase', 'purchases'), // Конверсия триал -> покупка
            mult('purchases', 'aov', 'mrr'),                // Предполагаем подписочную модель (AOV = MRR на клиента)
            multConst('mrr', 12, 'arr'),                    // arr = mrr * 12
            mult('cps', 'cvr_signup', 'cpc'),               // CPS * CVR_Signup = CPC
            mult('cpt', 'cvr_trial', 'cps'),                 // CPT * CVR_Trial = CPS
            mult('cac', 'cvr_trial_purchase', 'cpt'),       // CAC * CVR_Trial_Purchase = CPT
 
            // --- Алиасы для разных бизнес-моделей ---
            equal('cpa', 'cpo'),                            // CPA в Lead Gen = CPO в E-Com
            equal('cac', 'cpo'),                            // CAC в SaaS = CPO
            equal('mer', 'roas'),                           // MER = ROAS
            equal('roi', 'romi'),                           // ROI = ROMI
            equal('contribution_margin', 'net_profit'),     // CM = Net Profit (в рамках плановых затрат на трафик)
 
            // --- Прибыль (Profitability) ---
            mult('revenue', 'gross_margin', 'gross_profit'),
            sub('revenue', 'cogs', 'gross_profit'),         // Alternative entry point: COGS instead of Gross Margin %
            reciprocal('gross_margin', 'break_even_roas'),  // Break-Even ROAS = 1 / Gross Margin
            sub('gross_profit', 'ad_spend', 'net_profit'),
            mult('revenue', 'net_margin', 'net_profit'),
            mult('ad_spend', 'poas', 'gross_profit'),
            mult('ad_spend', 'romi', 'net_profit'),
            mult('roas', 'gross_margin', 'poas'),           // ROAS * Gross Margin = POAS
            mult('roas', 'net_margin', 'romi'),             // ROAS * Net Margin = ROMI
            subConst('poas', 1, 'romi'),                    // POAS - 1 = ROMI
 
            // --- Omnichannel & Offline (O2O) ---
            mult('clicks', 'cvr_visit', 'store_visits'),
            mult('store_visits', 'in_store_cvr', 'purchases'),
            mult('store_visits', 'cost_per_visit', 'ad_spend'),
            mult('clicks', 'cvr_call', 'calls'),
            mult('calls', 'cost_per_call', 'ad_spend'),
            mult('calls', 'cvr_call_to_purchase', 'purchases'),
            mult('calls', 'cvr_appointment', 'appointments'),
            mult('appointments', 'close_rate', 'purchases'),
            mult('cost_per_visit', 'cvr_visit', 'cpc'),
            mult('cost_per_call', 'cvr_call', 'cpc'),
            mult('cvr_visit', 'in_store_cvr', 'cvr'),
            mult('cvr_call', 'cvr_call_to_purchase', 'cvr'),
            mult('cvr_call', 'cvr_appointment', 'cvr_appointment_clicks'),
            mult('cvr_appointment_clicks', 'close_rate', 'cvr'),
            mult('cpo', 'roas', 'aov'),

            // --- Сложные LTV & CAC Payback через хелпер margin_adjusted_aov ---
            // margin_adjusted_aov = aov * gross_margin
            mult('aov', 'gross_margin', 'margin_adjusted_aov'),
            // ltv = margin_adjusted_aov / churn_rate  =>  ltv * churn_rate = margin_adjusted_aov
            mult('ltv', 'churn_rate', 'margin_adjusted_aov'),
            // cac_payback = cac / margin_adjusted_aov  =>  cac_payback * margin_adjusted_aov = cac
            mult('cac_payback', 'margin_adjusted_aov', 'cac'),
            // ltv_cac_ratio = ltv / cac  =>  cac * ltv_cac_ratio = ltv
            mult('cac', 'ltv_cac_ratio', 'ltv')
        ];
    }

    setInputs(inputs, lockedKeys = []) {
        this.clear();
        const lockedSet = new Set(Array.from(lockedKeys));

        for (const [key, value] of Object.entries(inputs)) {
            if (value !== undefined && value !== null && value !== '') {
                this.vars[key] = parseFloat(value);
                this.status[key] = lockedSet.has(key) ? 'locked' : 'user';
            }
        }
    }

    solve() {
        let changed = true;
        let iterations = 0;
        
        while (changed && iterations < 100) {
            changed = false;
            iterations++;
            
            for (let constraint of this.constraints) {
                let updates = constraint.evaluate(this.vars, this);
                for (let update of updates) {
                    let oldVal = this.vars[update.name];
                    if (oldVal === undefined || Math.abs(oldVal - update.value) > 1e-6) {
                        this.vars[update.name] = update.value;
                        if (this.status[update.name] !== 'locked') {
                            this.status[update.name] = update.override ? 'auto-calc' : 'calc';
                        }
                        changed = true;
                    }
                }
            }
        }
        return { vars: this.vars, status: this.status };
    }
}
