import { afterEach, describe, expect, test } from "bun:test"
import { Installation } from "../../src/installation"

const fetch0 = globalThis.fetch
const releaseRepo0 = process.env.OPENCODE_RELEASE_REPO
const installerUrl0 = process.env.OPENCODE_INSTALLER_URL

afterEach(() => {
  globalThis.fetch = fetch0
  if (releaseRepo0 === undefined) delete process.env.OPENCODE_RELEASE_REPO
  else process.env.OPENCODE_RELEASE_REPO = releaseRepo0
  if (installerUrl0 === undefined) delete process.env.OPENCODE_INSTALLER_URL
  else process.env.OPENCODE_INSTALLER_URL = installerUrl0
})

describe("installation", () => {
  test("uses configured GitHub release repo for curl installs", async () => {
    process.env.OPENCODE_RELEASE_REPO = "RhoninSeiei/opencode"
    let requested = ""
    globalThis.fetch = (async (input: string | URL | Request) => {
      requested = input.toString()
      return new Response(JSON.stringify({ tag_name: "v1.2.3" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    }) as unknown as typeof fetch

    expect(await Installation.latest("unknown")).toBe("1.2.3")
    expect(requested).toBe("https://api.github.com/repos/RhoninSeiei/opencode/releases/latest")
  })

  test("reads release version from GitHub releases", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ tag_name: "v1.2.3" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as unknown as typeof fetch

    expect(await Installation.latest("unknown")).toBe("1.2.3")
  })

  test("reads scoop manifest versions", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ version: "2.3.4" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as unknown as typeof fetch

    expect(await Installation.latest("scoop")).toBe("2.3.4")
  })

  test("reads chocolatey feed versions", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          d: {
            results: [{ Version: "3.4.5" }],
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      )) as unknown as typeof fetch

    expect(await Installation.latest("choco")).toBe("3.4.5")
  })

  test("uses configured installer url for curl upgrades", () => {
    process.env.OPENCODE_INSTALLER_URL = "https://raw.githubusercontent.com/RhoninSeiei/opencode/dev/install-fork.sh"

    expect(Installation.installerURL()).toBe(
      "https://raw.githubusercontent.com/RhoninSeiei/opencode/dev/install-fork.sh",
    )
  })
})
