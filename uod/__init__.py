"""
uod — Universal Ontology Definition SDK
=========================================
Python SDK for loading, querying, and exporting merged enterprise ontologies.

Usage:
    from uod import load_ontology

    ont = load_ontology("output/merged_ontology.json")
    eng = ont.get_class("Engagement")
    eng.children         # → ['SOEReformEngagement', ...]
    eng.attributes       # → [Attribute(id='engagement_code', ...)]
    eng.outgoing         # → [Relation(id='has_phase', ...)]

    ont.path("AIStrategyEngagement", "Goal")
    # → ['AIStrategyEngagement', '--measured_by-->', 'KPI', '--evaluates-->', 'Goal']

    ont.instances_of("OfferingPortfolio")
    # → [Instance(id='op_customer', label='Customer'), ...]
"""

from uod.graph import OntologyGraph, load_ontology

__version__ = "0.1.0"
__all__ = ["OntologyGraph", "load_ontology"]
