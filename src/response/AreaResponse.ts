
/**
 * Area item
 */
export interface AreaItem {
    
    /**
     * Uniq identifier
     */
    id: number;

    /**
     * Display name
     */
    name: string;

    /**
     * Parent area identifier
     */
    parent_id: number | null;

    /**
     * Sub areas
     */
    areas: AreaItem[] | null;
}