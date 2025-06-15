import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";

const client = generateClient<Schema>();

type Tags = Schema["Tags"]["type"];

const TagsView = () => {
    const [tags, setTags] = useState<Tags[]>([]);
    // State for new tag dialog and form values
    const [tagDialog, setTagDialog] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagDisplay, setNewTagDisplay] = useState(true);

    const tagsHeaderTemplate = (options: any) => {
        const className = `${options.className} justify-content-space-between align-items-center`;

        return (
            <div className={className}>
                <span className="font-bold">Tags</span>
                <div className="flex align-items-center">
                    <Button 
                        className="flex-shrink-0 mr-2" 
                        size="small" 
                        type="button" 
                        icon="pi pi-plus" 
                        severity="secondary" 
                        text 
                        onClick={() => setTagDialog(true)}  // ...open dialog on click...
                    />
                    {options.togglerElement}
                </div>
            </div>
        );
    };

    // Fetch tags data from the database
    const getTagsList = async () => {
        try {
            const response = await client.models.Tags.list();
            setTags(response.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    useEffect(() => {
        getTagsList();
    }, []);

    // Function to save new tag into database
    const saveTag = async () => {
        if (newTagName.trim() === "" || tags.map(tag => tag.name).includes(newTagName)) {
            alert("Tag name is required and must be unique.");
            return;
        }
        const tagInput = { name: newTagName, display: newTagDisplay };
        try {
            await client.models.Tags.create(tagInput);
            setTagDialog(false);
            setNewTagName("");
            setNewTagDisplay(true);
            getTagsList(); // Refresh the tags list after saving
        } catch (error) {
            console.error("Error saving tag:", error);
        }
    };

    return (
        <div className="">
            <Panel 
                className="mb-1" 
                headerTemplate={tagsHeaderTemplate} 
                expandIcon="pi pi-chevron-down" 
                collapseIcon="pi pi-chevron-up"
            >
                <DataTable 
                    value={tags} 
                    paginator 
                    rows={100} 
                    rowsPerPageOptions={[10, 25, 50, 100]} 
                    stripedRows 
                    showGridlines 
                    removableSort 
                    emptyMessage="No tags found."
                >
                    <Column field="name" header="Name" sortable style={{ padding: '0.2rem 0.3rem' }} />
                    <Column field="display" header="Display" sortable style={{ padding: '0.2rem 0.3rem' }} />
                </DataTable>
            </Panel>

            {/* Dialog for adding a new tag */}
            <Dialog 
                header="Add New Tag" 
                visible={tagDialog} 
                onHide={() => setTagDialog(false)}
                style={{ width: "30rem" }}
            >
                <div className="flex flex-column gap-2">
                    <label htmlFor="tagName">Tag Name</label>
                    <InputText 
                        id="tagName" 
                        value={newTagName} 
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Enter tag name"
                    />
                    <label htmlFor="toggleDisplay">Display</label>
                    <InputSwitch 
                        id="toggleDisplay" 
                        checked={newTagDisplay} 
                        onChange={(e) => setNewTagDisplay(e.value)}
                    />
                    <div className="flex justify-content-end mt-2">
                        <Button 
                            label="Cancel" 
                            className="p-button-text mr-2" 
                            onClick={() => setTagDialog(false)} 
                        />
                        <Button 
                            label="Save" 
                            icon="pi pi-save" 
                            onClick={saveTag} 
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TagsView;