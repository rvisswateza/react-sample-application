import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
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
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"></InputIcon>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
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
        <div className="">
            <DataTable value={names} paginator rows={100} rowsPerPageOptions={[10,25,50,100]} filters={filters} globalFilterFields={["id", "tags"]} header={header} emptyMessage="No names found.">
                <Column field="id" header="Name" style={{ maxWidth: '50%' }} />
                <Column field="chaldeanTotal" header="Chaldean Total" style={{ maxWidth: '10%' }} />
                <Column field="pythagoreanTotal" header="Pythagorean Total" style={{ maxWidth: '10%' }} />
                <Column field="chaldeanActual" header="Chaldean Actual" style={{ maxWidth: '10%' }} />
                <Column field="pythagoreanActual" header="Pythagorean Actual" style={{ maxWidth: '10%' }} />
            </DataTable>
        </div>
    );
};

export default NamesTable;