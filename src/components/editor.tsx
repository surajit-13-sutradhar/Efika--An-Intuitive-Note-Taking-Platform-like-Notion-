"use client"; 
import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { PartialBlock } from "@blocknote/core";
import { useEdgeStore } from "@/lib/edgestore";
import { useCallback } from "react";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const {edgestore} = useEdgeStore();

    const handleUpload = useCallback(async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file
        });
        return response.url;
    }, [edgestore]);

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload,
    });

    const handleChange = useCallback(() => {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    }, [editor, onChange]);
    
    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                editable={editable}
                onChange={handleChange}
            />
        </div>
    )
}

export default Editor;