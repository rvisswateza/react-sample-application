import { useEffect, useRef, useState } from "react";
import type { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Panel } from "primereact/panel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";
import NumberPicker from "./NumberPicker.tsx";

const client = generateClient<Schema>();

type Name = Schema["Names"]["type"];
type DropdownOption = { name: String, code: String }

FilterService.register('custom_tags', (value, filters) => {
    if (!filters || filters.length <= 1) {
        return true;
    }

    return filters.some((filterTag: string) => value.includes(filterTag));
});

const NamesTable = () => {
    const [names, setNames] = useState<Name[]>([]);
    const [viewName, setViewName] = useState<Name | null>(null);
    const [filters, setFilters] = useState({
        id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        tags: { value: [''], matchMode: FilterMatchMode.CUSTOM },
        chaldeanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
        pythagoreanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
        chaldeanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
        pythagoreanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
        letterCount: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const tags = ["Male", "Female", "General", "Office", "School", "College", "Hospital", "Shop", "Market", "Cafe"];
    const nameFilterDropdownOptions: DropdownOption[] = [
        { name: 'Starts with', code: FilterMatchMode.STARTS_WITH },
        { name: 'Ends with', code: FilterMatchMode.ENDS_WITH },
        { name: 'Contains', code: FilterMatchMode.CONTAINS },
        { name: 'Not contains', code: FilterMatchMode.NOT_CONTAINS },
    ];

    const getNamesList = async () => {
        const response = await client.models.Names.list();
        setNames(response.data);
    };

    useEffect(() => {
        getNamesList();
    }, []);

    const onTagChange = (e: CheckboxChangeEvent) => {
        let updatedTags: string[] = [];
        updatedTags = filters.tags.value || [];

        if (e.checked)
            updatedTags.push(e.value);
        else
            updatedTags.splice(updatedTags.indexOf(e.value), 1);

        setFilters((prevFilters: any) => ({
            ...prevFilters,
            tags: { ...prevFilters.tags, value: updatedTags }
        }))
    };

    const filtersHeaderTemplate = (options: any) => {
        const className = `${options.className} justify-content-space-between align-items-center`;

        return (
            <div className={className}>
                <span className="font-bold">Filters</span>
                <div className="flex align-items-center">
                    <Button className="flex-shrink-0 mr-2" size="small" type="button" icon="pi pi-filter-slash" severity="secondary" text onClick={clearFilters} />
                    {options.togglerElement}
                </div>
            </div>
        );
    };

    const clearFilters = () => {
        setFilters({
            id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            tags: { value: [''], matchMode: FilterMatchMode.CONTAINS },
            chaldeanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
            pythagoreanTotal: { value: null, matchMode: FilterMatchMode.EQUALS },
            chaldeanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
            pythagoreanActual: { value: null, matchMode: FilterMatchMode.EQUALS },
            letterCount: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
    };

    const countAlphanumericCharacters = (str: string) => {
        const alphanumericCharacters = str.match(/[a-zA-Z0-9]/g);
        return alphanumericCharacters ? alphanumericCharacters.length : 0;
    }

    const nameValueBodyTemplate = (name: Name) => {
        const menuRef = useRef<Menu>(null);

        const acceptDeletion = (name: string) => {
            client.models.Names.delete({ id: name })
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

        const actionItems: MenuItem[] = [
            {
                label: 'Actions',
                items: [
                    {
                        label: 'View',
                        icon: 'pi pi-eye',
                        command: () => setViewName(name),
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-trash',
                        command: () => deleteName(name.id),
                    }
                ]
            }
        ];

        return (
            <div className="flex justify-content-between align-items-center">
                <Menu model={actionItems} popup ref={menuRef} id={`${name}-action-menu`} />
                <div
                    className="flex justify-content-center align-items-center mr-1 hover:underline cursor-pointer"
                    onClick={(e) => menuRef.current?.toggle(e)}
                    aria-controls={`${name}-action-menu`}
                    aria-haspopup
                >
                    {name.id}
                </div>
                <div className="flex justify-content-center align-items-center border-round-xl border-1 h-min flex-shrink-0 w-2rem ">
                    {countAlphanumericCharacters(name.id)}
                </div>
            </div>
        );
    };

    const columnValuesHeaderTemplate = (format: string) => {
        return <div className="flex flex-column w-full">
            <div className="mb-1 text-sm">{format}</div>
            <div className="flex w-full">
                <div className="flex justify-content-center align-items-center border-round-xl text-xs mr-1">Total</div>
                <div className="flex justify-content-center align-items-center border-round-xl px-2 text-xs border-1">Actual</div>
            </div>
        </div>
    }

    const chaldeanValuesBodyTemplate = (name: Name) => {
        return <div className="flex">
            <div className="flex w-2rem justify-content-center align-items-center border-round-xl mr-1">{name.chaldeanTotal}</div>
            <div className="flex w-2rem justify-content-center align-items-center border-round-xl border-1 h-min flex-shrink-0 w-2rem ">{name.chaldeanActual}</div>
        </div>
    }

    const pythagoreanValuesBodyTemplate = (name: Name) => {
        return <div className="flex w-full">
            <div className="flex w-2rem justify-content-center align-items-center border-round-xl mr-1">{name.pythagoreanTotal}</div>
            <div className="flex w-2rem justify-content-center align-items-center border-round-xl border-1 h-min flex-shrink-0 w-2rem ">{name.pythagoreanActual}</div>
        </div>
    }

    return (
        <div className="">
            <Panel className="mb-1" headerTemplate={filtersHeaderTemplate} toggleable expandIcon="pi pi-chevron-down" collapseIcon="pi pi-chevron-up">
                <div className="grid">
                    <div className="col-12 flex flex-column md:flex-row md:align-items-center">
                        <label className="mr-2 mb-2 md:mb-0">Chaldean Actual:</label>
                        <NumberPicker
                            value={filters.chaldeanActual.value}
                            min={1}
                            max={9}
                            onChange={(value) =>
                                setFilters((prevFilters: any) => ({
                                    ...prevFilters,
                                    chaldeanActual: { ...prevFilters.chaldeanActual, value: value }
                                }))
                            }
                        />
                    </div>
                    <div className="col-12 flex flex-column md:flex-row md:align-items-center">
                        <label className="mr-2 mb-2 md:mb-0">Pythagorean Actual:</label>
                        <NumberPicker
                            value={filters.pythagoreanActual.value}
                            min={1}
                            max={9}
                            onChange={(value) =>
                                setFilters((prevFilters: any) => ({
                                    ...prevFilters,
                                    pythagoreanActual: { ...prevFilters.pythagoreanActual, value: value }
                                }))
                            }
                        />
                    </div>
                    <div className="col-12 flex flex-column md:flex-row md:align-items-center">
                        <label className="mr-2 mb-2 md:mb-0">Name:</label>
                        <div className="flex w-full md:mr-2 mb-2 md:mb-0">
                            <Dropdown
                                value={nameFilterDropdownOptions.find((item) => item.code === filters.id.matchMode)}
                                options={nameFilterDropdownOptions}
                                onChange={(e) =>
                                    setFilters((prevFilters: any) => ({
                                        ...prevFilters,
                                        id: { ...prevFilters.id, matchMode: e.value.code }
                                    }))
                                }
                                optionLabel="name"
                                placeholder="Select a filter mode"
                                className="mr-2 w-full"
                            />
                            <InputText
                                value={filters.letterCount.value}
                                onChange={(e) =>
                                    setFilters((prevFilters: any) => ({
                                        ...prevFilters,
                                        letterCount: { ...prevFilters.letterCount, value: e.target.value }
                                    }))
                                }
                                placeholder="Name length"
                                className="w-full"
                            />
                        </div>
                        <InputText
                            value={filters.id.value}
                            onChange={(e) =>
                                setFilters((prevFilters: any) => ({
                                    ...prevFilters,
                                    id: { ...prevFilters.id, value: (e.target.value === '' ? null : e.target.value.toUpperCase()) }
                                }))
                            }
                            placeholder="Search by name"
                            className="mr-2 mb-2 md:mb-0 w-full"
                        />
                    </div>
                    <div className="col-12 grid gap-1">
                        <label className='col'>Tags:</label>
                        {tags.map(tag => (
                            <div key={tag} className="flex col align-items-center">
                                <Checkbox
                                    inputId={tag}
                                    value={tag}
                                    onChange={onTagChange}
                                    checked={filters.tags.value && filters.tags.value.includes(tag)}
                                />
                                <label htmlFor={tag} className="ml-2">{tag}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </Panel>

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

            <DataTable value={names} paginator rows={100} rowsPerPageOptions={[10, 25, 50, 100]} stripedRows showGridlines removableSort filters={filters} emptyMessage="No names found.">
                <Column field="id" header="Name" sortable body={nameValueBodyTemplate} style={{ padding: '0.2rem 0.3rem' }} />
                <Column field="chaldeanActual" header={columnValuesHeaderTemplate("Chaldean")} body={chaldeanValuesBodyTemplate} style={{ padding: '0.2rem 0.3rem' }} />
                <Column field="pythagoreanActual" header={columnValuesHeaderTemplate("Pythagorean")} body={pythagoreanValuesBodyTemplate} style={{ padding: '0.2rem 0.3rem' }} />
            </DataTable>
        </div>
    );
};

export default NamesTable;