export interface VacancyResponse {
    items: VacancyItem[];
    found: number;
}
export interface VacancyItem {
    salary: VacancyItemSalary | null;
}
export interface VacancyItemSalary {
    from: number | null;
    to: number | null;
    currency: string | null;
}
