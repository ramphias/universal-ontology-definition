# Local Validation

This project uses Python scripts to validate ontology JSON files, merge layers, and generate derived outputs. The validation scripts are intentionally lightweight and use only the Python standard library.

本项目使用 Python 脚本校验 ontology JSON、合并层级并生成衍生格式。核心校验脚本保持轻量，运行时只依赖 Python 标准库。

## Prerequisites

- Python 3.12 or newer
- Git
- A shell terminal, such as PowerShell, Windows Terminal, bash, or zsh

Check your Python installation:

=== "Windows"

    ```powershell
    py -3 --version
    python --version
    ```

    If both commands fail, install Python from [python.org](https://www.python.org/downloads/) and enable "Add python.exe to PATH" during installation.

=== "macOS / Linux"

    ```bash
    python3 --version
    ```

## Create a Virtual Environment

Create the environment at the repository root:

=== "Windows PowerShell"

    ```powershell
    py -3 -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python --version
    ```

    If PowerShell blocks activation because script execution is disabled, you can either use the interpreter path directly:

    ```powershell
    .\.venv\Scripts\python.exe scripts\validate_governance.py
    ```

    Or relax the execution policy for the current user:

    ```powershell
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
    ```

=== "Windows CMD"

    ```bat
    py -3 -m venv .venv
    .venv\Scripts\activate.bat
    python --version
    ```

=== "macOS / Linux"

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    python --version
    ```

## Run the Core Checks

Run these commands before opening a PR that changes ontology JSON or scripts:

```bash
python scripts/validate_governance.py
python scripts/validate_l3.py --all
python scripts/merge_layers.py l3-enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
```

Expected result:

- `validate_governance.py` reports no failed L1 governance checks.
- `validate_l3.py --all` reports PASS for all L2/L3 ontology files.
- `merge_layers.py` writes merged output for the Acme L3 sample.

## Validate JSON Syntax

If you only need a quick JSON parse check:

=== "Windows PowerShell"

    ```powershell
    Get-ChildItem l1-core,l2-extensions,l3-enterprise,schema -Recurse -Filter *.json |
      ForEach-Object {
        Get-Content -Encoding UTF8 -Raw $_.FullName | ConvertFrom-Json | Out-Null
      }
    ```

=== "Python"

    ```bash
    python -c "import json, pathlib; [json.load(open(p, encoding='utf-8')) for p in pathlib.Path('.').glob('**/*.json') if 'node_modules' not in p.parts]; print('JSON OK')"
    ```

## Generate Derived Outputs

After changing L1/L2/L3 JSON, regenerate derived formats as needed:

```bash
python scripts/json_to_owl.py
python scripts/export_neo4j.py l1-core/universal_ontology_v1.json
python scripts/export_for_llm.py l1-core/universal_ontology_v1.json
python scripts/visualize_ontology.py
```

Do not manually edit generated `.ttl`, `.cypher`, exported LLM files, or merged `output/` artifacts.

## Troubleshooting

| Symptom | Cause | Fix |
|:---|:---|:---|
| `python` is not recognized | Python is not installed or not on PATH | Install Python and enable PATH, or use `py -3` on Windows |
| `failed to locate pyvenv.cfg` | The `.venv` directory is incomplete or copied from another machine | Delete `.venv` and recreate it with `python -m venv .venv` |
| PowerShell blocks `Activate.ps1` | Execution policy blocks local scripts | Run the `.venv\Scripts\python.exe` path directly, or set `RemoteSigned` for the current user |
| `validate_l3.py --all` finds no files | Running from the wrong directory | Run commands from the repository root |
| Private enterprise merge fails | `private_enterprise/` is not present in public clones | Validate public L3 samples unless you have the private files locally |

## CI Parity

GitHub Actions runs the same validation workflow on ontology and script changes:

```bash
python scripts/validate_governance.py
python scripts/validate_l3.py --all
python scripts/merge_layers.py l3-enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
```

Keeping local validation aligned with CI makes PR review faster and keeps the source JSON, generated outputs, and documentation from drifting apart.
