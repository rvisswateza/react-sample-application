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
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const client = generateClient<Schema>();

type Name = Schema["Names"]["type"];

const NamesTable = () => {
    const [names, setNames] = useState<Name[]>([]);
    const [viewName, setViewName] = useState<Name | null>(null);
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

    const tableHeader = () => {
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

    const actionColumnBody = (name: Name) => {
        return <div className="flex">
            <Button
                className="mx-1"
                icon="pi pi-eye"
                severity="info"
                style={{height:"1.5rem", width:"1.5rem"}}
                size="small"
                outlined
                onClick={() => setViewName(name)}
            />
            <Button
                className="mx-1"
                icon="pi pi-trash"
                severity="danger"
                style={{height:"1.5rem", width:"1.5rem"}}
                size="small"
                outlined
                onClick={() => deleteName(name.id)}
            />
        </div>
    }

    const acceptDeletion = (name: string) => {
        client.models.Names.delete({id: name})
        setNames(names.filter((item) => item.id !== name))
        return;
    };

    const rejectDeletion = () => {
        return;
    };
    
    const deleteName = (name: string) => {
        confirmDialog({
            message: `Are you sure you want to delete ${name}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => acceptDeletion(name),
            reject: rejectDeletion
        });
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

    return (
        <div className="">
            <ConfirmDialog />
            <Dialog onHide={() => setViewName(null)} visible={!!viewName} style={{ width: "50%" }} header="Name Details">
                {viewName && (
                    <div className="flex flex-column gap-2">
                        <div>
                            <strong>Name:</strong> {viewName.id}
                        </div>
                        <div>
                            <strong>Tags:</strong> {viewName.tags.join(", ")}
                        </div>
                        <div>
                            <strong>Chaldean Total:</strong> {viewName.chaldeanTotal}
                        </div>
                        <div>
                            <strong>Pythagorean Total:</strong> {viewName.pythagoreanTotal}
                        </div>
                        <div>
                            <strong>Chaldean Actual:</strong> {viewName.chaldeanActual}
                        </div>
                        <div>
                            <strong>Pythagorean Actual:</strong> {viewName.pythagoreanActual}
                        </div>
                        <div>
                            <strong>Chaldean Vowels:</strong> {viewName.chaldeanVowels}
                        </div>
                        <div className="text-primary">
                            <strong>Pythagorean Vowels:</strong> {viewName.pythagoreanVowels}
                        </div>
                        <div>
                            <strong>Chaldean Consonants:</strong> {viewName.chaldeanConsonants}
                        </div>
                        <div className="text-primary">
                            <strong>Pythagorean Consonants:</strong> {viewName.pythagoreanConsonants}
                        </div>
                    </div>
                )}
            </Dialog>

            <DataTable value={names} paginator rows={100} stripedRows showGridlines rowsPerPageOptions={[10, 25, 50, 100]} filters={filters} globalFilterFields={["id", "tags"]} header={tableHeader} emptyMessage="No names found.">
                <Column field="id" header="Name" style={{ width: '50%', padding: '0.2rem 0.5rem' }} />
                <Column field="chaldeanTotal" header="Chaldean Total" style={{ width: '10%', padding: '0.2rem 0.5rem' }} />
                <Column field="pythagoreanTotal" header="Pythagorean Total" style={{ width: '10%', padding: '0.2rem 0.5rem' }} />
                <Column field="chaldeanActual" header="Chaldean Actual" style={{ width: '10%', padding: '0.2rem 0.5rem' }} />
                <Column field="pythagoreanActual" header="Pythagorean Actual" style={{ width: '10%', padding: '0.2rem 0.5rem' }} />
                <Column field="id" header="Actions" style={{ width: '10%', padding: '0.2rem 0.5rem' }} body={actionColumnBody} />
            </DataTable>
        </div>
    );
};

export default NamesTable;