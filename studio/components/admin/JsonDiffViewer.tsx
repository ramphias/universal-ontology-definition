"use client";

import { useMemo } from "react";
import * as jsondiffpatch from "jsondiffpatch";
import * as htmlFormatter from "jsondiffpatch/formatters/html";
import "jsondiffpatch/formatters/styles/html.css";

const differ = jsondiffpatch.create({
    // Identify nested object items by id so a class diff stays scoped to the
    // class and we don't get noisy reorders. We deliberately don't pass a
    // `textDiff` option — jsondiffpatch 0.7+ requires bundling the
    // `diff-match-patch` runtime for it, and the metadata strings we diff
    // are short enough that a whole-string replace renders fine.
    objectHash: (obj: any) => obj?.id ?? JSON.stringify(obj),
});

type Props = {
    before: unknown;
    after: unknown;
};

/**
 * Render a structured before→after diff using jsondiffpatch's HTML formatter.
 * The component is client-only so the diff library doesn't ship in the
 * server bundle.
 */
export default function JsonDiffViewer({ before, after }: Props) {
    const html = useMemo(() => {
        const delta = differ.diff(before, after);
        if (!delta) {
            return `<div class="text-[#666] italic px-2 py-1">No structural changes.</div>`;
        }
        return htmlFormatter.format(delta, before);
    }, [before, after]);

    return (
        <div
            className="jsondiffpatch-host bg-[#0A0A0A] border border-[#222] rounded p-3 text-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}
