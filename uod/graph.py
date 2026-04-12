"""
uod.graph — Core OntologyGraph class
======================================
Loads a merged ontology JSON and provides query, traversal, and export methods.
"""

import json
from pathlib import Path
from collections import deque
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Set


@dataclass
class OntologyClass:
    id: str
    label_en: str = ""
    label_zh: str = ""
    parent: Optional[str] = None
    alias_of: Optional[str] = None
    layer: str = ""
    domain: str = ""
    abstract: bool = False
    status: str = "stable"
    since: str = ""
    definition_en: str = ""
    definition_zh: str = ""

    # Populated after graph construction
    children: List[str] = field(default_factory=list)
    attributes: list = field(default_factory=list)
    outgoing: list = field(default_factory=list)
    incoming: list = field(default_factory=list)
    instances: list = field(default_factory=list)


@dataclass
class Relation:
    id: str
    domain: str = ""
    range: str = ""
    cardinality: str = ""
    layer: str = ""
    definition_en: str = ""
    definition_zh: str = ""


@dataclass
class Attribute:
    id: str
    owner_class: str = ""
    datatype: str = ""
    required: bool = False
    enum_values: List[str] = field(default_factory=list)
    definition_en: str = ""
    definition_zh: str = ""


@dataclass
class Instance:
    id: str
    label: str = ""
    label_zh: str = ""
    type: str = ""
    layer: str = ""


class OntologyGraph:
    """In-memory ontology graph with query capabilities."""

    def __init__(self, data: dict):
        self.meta = data.get("metadata", {})
        self.name = self.meta.get("name", "Ontology")

        # Build class map
        self._classes: Dict[str, OntologyClass] = {}
        for c in data.get("classes", []):
            oc = OntologyClass(
                id=c["id"],
                label_en=c.get("label_en", c["id"]),
                label_zh=c.get("label_zh", ""),
                parent=c.get("parent"),
                alias_of=c.get("alias_of"),
                layer=c.get("source_layer", ""),
                domain=c.get("domain", ""),
                abstract=c.get("abstract", False),
                status=c.get("status", "stable"),
                since=c.get("since", ""),
                definition_en=c.get("definition_en", ""),
                definition_zh=c.get("definition", ""),
            )
            self._classes[oc.id] = oc

        # Build children lists
        for cid, oc in self._classes.items():
            if oc.parent and oc.parent in self._classes:
                self._classes[oc.parent].children.append(cid)

        # Build relations
        self._relations: Dict[str, Relation] = {}
        for r in data.get("relations", []):
            rel = Relation(
                id=r["id"],
                domain=r.get("domain", ""),
                range=r.get("range", ""),
                cardinality=r.get("cardinality", ""),
                layer=r.get("source_layer", ""),
                definition_en=r.get("definition_en", ""),
                definition_zh=r.get("definition", ""),
            )
            self._relations[rel.id] = rel
            if rel.domain in self._classes:
                self._classes[rel.domain].outgoing.append(rel)
            if rel.range in self._classes:
                self._classes[rel.range].incoming.append(rel)

        # Build attributes
        self._attributes: Dict[str, Attribute] = {}
        for a in data.get("attributes", []):
            attr = Attribute(
                id=a["id"],
                owner_class=a.get("owner_class", ""),
                datatype=a.get("datatype", ""),
                required=a.get("required", False),
                enum_values=a.get("enum_values", []),
                definition_en=a.get("definition_en", ""),
                definition_zh=a.get("definition", ""),
            )
            self._attributes[attr.id] = attr
            if attr.owner_class in self._classes:
                self._classes[attr.owner_class].attributes.append(attr)

        # Build instances
        self._instances: Dict[str, Instance] = {}
        for i in data.get("sample_instances", []):
            inst = Instance(
                id=i["id"],
                label=i.get("label", i["id"]),
                label_zh=i.get("label_zh", ""),
                type=i.get("type", ""),
                layer=i.get("source_layer", ""),
            )
            self._instances[inst.id] = inst
            if inst.type in self._classes:
                self._classes[inst.type].instances.append(inst)

        # Axioms
        self.axioms = data.get("axioms", [])

        # Build adjacency for path finding (class_id → [(neighbor_id, relation_label)])
        self._adj: Dict[str, List[tuple]] = {}
        for cid in self._classes:
            self._adj.setdefault(cid, [])
        for rel in self._relations.values():
            if rel.domain in self._classes and rel.range in self._classes:
                self._adj.setdefault(rel.domain, []).append((rel.range, rel.id))
                self._adj.setdefault(rel.range, []).append((rel.domain, f"~{rel.id}"))
        # Inheritance edges
        for cid, oc in self._classes.items():
            if oc.parent and oc.parent in self._classes:
                self._adj.setdefault(cid, []).append((oc.parent, "subClassOf"))
                self._adj.setdefault(oc.parent, []).append((cid, "~subClassOf"))

    # ── Query methods ────────────────────────────────────────────────────────

    def get_class(self, class_id: str) -> Optional[OntologyClass]:
        """Get a class by ID."""
        return self._classes.get(class_id)

    def get_relation(self, rel_id: str) -> Optional[Relation]:
        """Get a relation by ID."""
        return self._relations.get(rel_id)

    def get_instance(self, inst_id: str) -> Optional[Instance]:
        """Get an instance by ID."""
        return self._instances.get(inst_id)

    @property
    def classes(self) -> Dict[str, OntologyClass]:
        return self._classes

    @property
    def relations(self) -> Dict[str, Relation]:
        return self._relations

    @property
    def instances(self) -> Dict[str, Instance]:
        return self._instances

    @property
    def attributes(self) -> Dict[str, Attribute]:
        return self._attributes

    def instances_of(self, class_id: str, include_subclasses: bool = True) -> List[Instance]:
        """List instances of a class, optionally including instances of subclasses."""
        target_ids = {class_id}
        if include_subclasses:
            target_ids = self.descendants(class_id) | {class_id}
        return [i for i in self._instances.values() if i.type in target_ids]

    def ancestors(self, class_id: str) -> List[str]:
        """Get all ancestors of a class (parent chain up to root)."""
        result = []
        cur = class_id
        visited = set()
        while cur and cur in self._classes and cur not in visited:
            visited.add(cur)
            parent = self._classes[cur].parent
            if parent:
                result.append(parent)
            cur = parent
        return result

    def descendants(self, class_id: str) -> Set[str]:
        """Get all descendants of a class (recursive children)."""
        result = set()
        queue = deque([class_id])
        while queue:
            cur = queue.popleft()
            oc = self._classes.get(cur)
            if oc:
                for child in oc.children:
                    if child not in result:
                        result.add(child)
                        queue.append(child)
        return result

    def inherited_attributes(self, class_id: str) -> List[Attribute]:
        """Get all attributes for a class including inherited ones from ancestors."""
        result = []
        seen = set()
        chain = [class_id] + self.ancestors(class_id)
        for cid in chain:
            oc = self._classes.get(cid)
            if oc:
                for attr in oc.attributes:
                    if attr.id not in seen:
                        seen.add(attr.id)
                        result.append(attr)
        return result

    def path(self, from_class: str, to_class: str, max_hops: int = 5) -> Optional[List[str]]:
        """Find shortest path between two classes via relations and inheritance.
        Returns list like ['A', '--has_phase-->', 'B', '--evaluates-->', 'C']
        or None if no path found within max_hops.
        """
        if from_class not in self._classes or to_class not in self._classes:
            return None
        if from_class == to_class:
            return [from_class]

        # BFS
        queue = deque([(from_class, [from_class])])
        visited = {from_class}

        while queue:
            cur, cur_path = queue.popleft()
            if len(cur_path) > max_hops * 2 + 1:
                continue

            for neighbor, rel_label in self._adj.get(cur, []):
                if neighbor in visited:
                    continue
                visited.add(neighbor)
                direction = "-->" if not rel_label.startswith("~") else "<--"
                clean_label = rel_label.lstrip("~")
                new_path = cur_path + [f"--{clean_label}{direction}", neighbor]

                if neighbor == to_class:
                    return new_path
                queue.append((neighbor, new_path))

        return None

    def search(self, query: str) -> List[OntologyClass]:
        """Search classes by ID, label, or definition (case-insensitive)."""
        q = query.lower()
        results = []
        for oc in self._classes.values():
            if (q in oc.id.lower() or q in oc.label_en.lower() or
                q in oc.label_zh.lower() or q in oc.definition_en.lower()):
                results.append(oc)
        return results

    def stats(self) -> dict:
        """Return summary statistics."""
        layers = {}
        for oc in self._classes.values():
            layer = oc.layer[:2] if oc.layer else "?"
            layers[layer] = layers.get(layer, 0) + 1
        return {
            "name": self.name,
            "classes": len(self._classes),
            "relations": len(self._relations),
            "attributes": len(self._attributes),
            "instances": len(self._instances),
            "axioms": len(self.axioms),
            "by_layer": layers,
        }

    def __repr__(self):
        s = self.stats()
        return f"OntologyGraph('{s['name']}', {s['classes']} classes, {s['relations']} relations)"


def load_ontology(path: str) -> OntologyGraph:
    """Load a merged ontology JSON file and return an OntologyGraph."""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return OntologyGraph(data)
