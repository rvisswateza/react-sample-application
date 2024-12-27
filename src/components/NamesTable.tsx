import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";

const client = generateClient<Schema>();

type Name = Schema["Names"]["type"];

const NamesTable = () => {
    const [names, setNames] = useState<Name[]>([]);
    const [filters, setFilters] = useState({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
        pythagoreanVowels: { value: null, matchMode: FilterMatchMode.EQUALS },
        chaldeanVowels: { value: null, matchMode: FilterMatchMode.EQUALS },
        pythagoreanConsonants: { value: null, matchMode: FilterMatchMode.EQUALS },
        chaldeanConsonants: { value: null, matchMode: FilterMatchMode.EQUALS },
        pythagoreanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
        chaldeanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
        pythagoreanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
        chaldeanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

    const getNamesList = async () => {
        const response = await client.models.Names.list();
        setNames(response.data);
    };

    useEffect(() => {
        getNamesList();
    }, []);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilters} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const clearFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS },
            id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
            pythagoreanVowels: { value: null, matchMode: FilterMatchMode.EQUALS },
            chaldeanVowels: { value: null, matchMode: FilterMatchMode.EQUALS },
            pythagoreanConsonants: { value: null, matchMode: FilterMatchMode.EQUALS },
            chaldeanConsonants: { value: null, matchMode: FilterMatchMode.EQUALS },
            pythagoreanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
            chaldeanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
            pythagoreanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
            chaldeanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
        setGlobalFilterValue("");
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={names} paginator rows={10} filters={filters} globalFilterFields={["id", "tags"]} header={header} emptyMessage="No names found.">
                <Column field="id" header="ID" filter filterPlaceholder="Search by ID" style={{ minWidth: '12rem' }} />
                <Column field="tags" header="Tags" filter filterPlaceholder="Search by Tags" style={{ minWidth: '12rem' }} />
                <Column field="pythagoreanVowels" header="Pythagorean Vowels" filter filterPlaceholder="Equals" style={{ minWidth: '14rem' }} />
                <Column field="chaldeanVowels" header="Chaldean Vowels" filter filterPlaceholder="Equals" style={{ minWidth: '14rem' }} />
                <Column field="pythagoreanConsonants" header="Pythagorean Consonants" filter filterPlaceholder="Equals" style={{ minWidth: '16rem' }} />
                <Column field="chaldeanConsonants" header="Chaldean Consonants" filter filterPlaceholder="Equals" style={{ minWidth: '16rem' }} />
                <Column field="pythagoreanTotal" header="Pythagorean Total" filter filterPlaceholder="Equals" style={{ minWidth: '14rem' }} />
                <Column field="chaldeanTotal" header="Chaldean Total" filter filterPlaceholder="Equals" style={{ minWidth: '14rem' }} />
                <Column field="pythagoreanActual" header="Pythagorean Actual" filter filterPlaceholder="Equals" style={{ minWidth: '14rem' }} />
                <Column field="chaldeanActual" header="Chaldean Actual" filter filterPlaceholder="Equals" style={{ minWidth: '14rem' }} />
            </DataTable>
        </div>
    );
};

export default NamesTable;