# Code signing policy

## Current status / 現在の状態

**Public EXE downloads are currently unsigned. SignPath approval has not been obtained.**
公開中のEXEは未署名です。「発行元不明」はまだ解消していません。
製品情報のCompanyNameは電子署名とは異なり、発行元を証明するものではありません。

## Free signing route / 無料署名の方針

We are preparing to apply to [SignPath Foundation](https://signpath.org/apply)
for its free open-source signing service. Acceptance is subject to their review;
no sponsorship or certificate is claimed before approval.
The project-owned code is Apache-2.0. Third-party components retain their own licenses.

無料署名はSignPath FoundationのOSS審査を利用する方針です。
申請・審査・GitHub連携・各リリースの承認が必要で、採用は保証されません。
承認された場合、表示される署名者はSO-SHO開発者個人ではなくSignPath Foundationです。
承認後に同財団の指定する帰属表示を追加します。

Alternative: [Microsoft Store MSIX publication](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)
provides free Store signing, but requires developer registration, identity verification,
MSIX packaging and certification. Uploading the existing EXE to the Store does not
give it a free signature.

## Roles

- Maintainer, reviewer and intended release approver: [robo1129-ops](https://github.com/robo1129-ops).
- Signing requests require approval in SignPath after project acceptance.
- GitHub/SignPath accounts must enable multi-factor authentication as required by SignPath.

## Privacy

The bridge exposes a local WebSocket endpoint and communicates with the selected
keyboard through Windows Bluetooth. It does not upload keymaps, pairing information
or connection logs to a remote server. It returns device names, status and RPC bytes
to its local client. The website and Windows Bluetooth services have their own
network behavior; this policy describes the bridge only.

## Build and verification

`.github/workflows/windows-ble-release.yml` builds the bridge from checked-in source
on a GitHub-hosted Windows runner. The default run creates an **unsigned development
artifact**, not a signed release.

After SignPath approval, configure these repository variables:

- `SIGNPATH_ORGANIZATION_ID`
- `SIGNPATH_PROJECT_SLUG`
- `SIGNPATH_SIGNING_POLICY_SLUG`
- `SIGNPATH_BRIDGE_CONFIGURATION`
- `SIGNPATH_INSTALLER_CONFIGURATION`

Store the submitter API token in the GitHub secret `SIGNPATH_API_TOKEN`, never in a
source file, chat message or public log. Configure both artifact configurations as
ZIPs containing the respective EXE, with ProductName `SO-SHO Windows BLE Bridge`
and ProductVersion `1.0.0.0`. Match them to the actual workflow output and review
the settings with SignPath before enabling production signing.

Run the workflow with `sign=true`. It uploads the bridge, requests a signature,
verifies the signature and timestamp, embeds the signed bridge into the installer,
requests a second signature, and verifies both EXEs. Only after those checks pass
does it create `verified-signed-release`. It does not replace the public download
automatically. Update the website only with that verified installer after review.

`build-release.ps1 -Phase installer` refuses an unsigned bridge, and `-Phase verify`
refuses missing, invalid, or untimestamped signatures. No certificates are installed
into users' trust stores and Windows security settings are not changed.

Local build:

```powershell
./windows-ble-bridge/build-release.ps1 -Phase bridge
```

Signing identifies the publisher. SmartScreen reputation and organization policy
are separate checks, so a valid signature does not guarantee that every PC will
accept the program without a warning.

## Application information prepared for the maintainer

- Project: SO-SHO Windows BLE Bridge
- Repository: https://github.com/robo1129-ops/sosho
- Website: https://robo1129-ops.github.io/sosho/
- Source directory: windows-ble-bridge
- License: Apache-2.0 for project-owned code
- Purpose: A local Windows Bluetooth GATT bridge for reading and editing the user's keyboard keymap.
- Installation: current-user folder and current-user startup shortcut; uninstall instructions included.
- Signing scope: project-owned bridge EXE and setup EXE, built by the checked-in GitHub workflow.

The maintainer must provide their own contact information and complete the service
application/account steps. No application has been submitted by this change.

## References

- https://signpath.org/terms
- https://docs.signpath.io/trusted-build-systems/github
- https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options
