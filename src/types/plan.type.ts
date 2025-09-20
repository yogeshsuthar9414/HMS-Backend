export interface getPlanList {
    id: number,
    plan_nm: string,
    price: any,
    validate_for: number,
    validate_type: any,
    is_active: boolean,
    description: string | null,
    entry_by: number | null,
    entry_dt: Date | null,
    update_by: number | null,
    update_dt: Date | null,
}