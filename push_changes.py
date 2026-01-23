#!/usr/bin/env python3
import datetime
import subprocess
import sys


def run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, check=False, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr.strip() or result.stdout.strip())
        sys.exit(result.returncode)
    return result.stdout.strip()


def main() -> None:
    run(["git", "rev-parse", "--is-inside-work-tree"])

    status = run(["git", "status", "--porcelain"])
    if not status:
        print("No changes to commit.")
        return

    run(["git", "add", "."])

    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    message = f"Update site ({timestamp})."
    run(["git", "commit", "-m", message])

    run(["git", "push"])
    print("Changes pushed.")


if __name__ == "__main__":
    main()
