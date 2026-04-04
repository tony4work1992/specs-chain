# A3 API Specs Guide

API specs expose behavior already defined by BRD, FRD, and A4.

Rules:

- one file per endpoint
- do not introduce fields not present in A4
- include validation, process flow, and error definitions
- name any cross-module dependencies explicitly as ports, facades, or query services
