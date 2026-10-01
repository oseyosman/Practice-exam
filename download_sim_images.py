import os
import requests
import re
import time

URLS = [
    # fc-cs0003-57
    ("https://www.freecram.net/uploads/CS0-003/f926637be12f0e90b7fb31b028163af1.jpg", "images/sim-57-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/6a1246f01972f62560f32f1ceebd1068.jpg", "images/sim-57-2.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/2416954cb83b4eae5b9d7a974c078b4c.jpg", "images/sim-57-3.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/a263e92432cf5b8e1e815296638ff377.jpg", "images/sim-57-ans.jpg"),

    # fc-cs0003-79
    ("https://www.freecram.net/uploads/CS0-003/1434cf24887cdf8a56b634b861dff521.jpg", "images/sim-79-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/ab26168e0b363617c91d24a7d72f3845.jpg", "images/sim-79-2.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/b1b40ff7d022ef4e969739358877374e.jpg", "images/sim-79-3.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/2eb96d2ce7af77e29e027b4dd7184ade.jpg", "images/sim-79-4.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/9af4bfec33e61c9b395e73de893aaa96.jpg", "images/sim-79-ans.jpg"),

    # fc-cs0003-128
    ("https://www.freecram.net/uploads/CS0-003/18cf98234b18abd777b3523034493103.jpg", "images/sim-128-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/79eeb32fd229fc7ce4d615d0dfd002ea.jpg", "images/sim-128-ans.jpg"),

    # fc-cs0003-157
    ("https://www.freecram.net/uploads/CS0-003/946c3ef66ac30faa2eb9fd94d6a6107f.jpg", "images/sim-157-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/30069a51d0756616216ec8bb5c09a119.jpg", "images/sim-157-2.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/e4427dd8d93c0cd54c2dd884444f9345.jpg", "images/sim-157-3.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/225c7cf0628fc02b589c240964b7fcbb.jpg", "images/sim-157-4.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/7b2867190a75f7e707dbe74f5d68cd10.jpg", "images/sim-157-5.jpg"),

    # fc-cs0003-240
    ("https://www.freecram.net/uploads/CS0-003/c213962ce886edef631ae0b9777d2b49.jpg", "images/sim-240-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/528b7fdb1813f9aa68f8ec5316b1d966.jpg", "images/sim-240-ans.jpg"),

    # fc-cs0003-266
    ("https://www.freecram.net/uploads/CS0-003/dcd221c20102990d4f533ea1ec04da5c.jpg", "images/sim-266-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/438b0f2e23627c8f460afd046b8ff580.jpg", "images/sim-266-2.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/3aec2acc54d4c7505f30945e85123be5.jpg", "images/sim-266-3.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/9d5eb641d30e18b2b91138b2be1946c0.jpg", "images/sim-266-4.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/70cda5303c9477ee88b415d2aed1bf39.jpg", "images/sim-266-5.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/19b33b601a6ea1ed6baa010d15a70934.jpg", "images/sim-266-6.jpg"),

    # fc-cs0003-286
    ("https://www.freecram.net/uploads/CS0-003/7032bf3a77a0b9cf63cd369713f96fb8.jpg", "images/sim-286-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/87a070b611576e8db992cdbeb64646c1.jpg", "images/sim-286-2.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/bed50be144479e1f3386bfa9ab55537f.jpg", "images/sim-286-3.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/e1626788a9f4879822ecfc9ad467c62f.jpg", "images/sim-286-4.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/48e2c62e3b3e090b88a6873b9be9b08b.jpg", "images/sim-286-5.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/909b72223cf1e529d58a47d2c85502c6.jpg", "images/sim-286-6.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/06a9fa599a2181205df12b1627fa3a52.jpg", "images/sim-286-7.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/f958d00128c9db4a77b34e0ad0c00a71.jpg", "images/sim-286-8.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/db96c8d18bdc70ba7103a1a8d00b3c21.jpg", "images/sim-286-9.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/04fd9dc5b7637b4cb0bd7f9ca96547c3.jpg", "images/sim-286-ans1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/e7ef9be087bcdffe8f63e3c3f920b114.jpg", "images/sim-286-ans2.jpg"),

    # fc-cs0003-313
    ("https://www.freecram.net/uploads/CS0-003/bb42d8ebf97419e37cd164da848251e4.jpg", "images/sim-313-1.jpg"),
    ("https://www.freecram.net/uploads/CS0-003/bbfb0e5f94f423543ed1c1e892be4ac8.jpg", "images/sim-313-ans.jpg")
]

os.makedirs("images", exist_ok=True)

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer": "https://www.freecram.net"
})

try:
    torrent_url = "https://www.freecram.net/torrent/CuramSoftware.CS0-003.v2026-09-21.q313.html"
    r = session.get(torrent_url, timeout=10)
    match = re.search(r"var a='([^']+)'", r.text)
    if match:
        session.cookies.set("__ckreal", match.group(1), domain=".freecram.net")
        print("Session cookie obtained.")
except Exception as e:
    print(f"Cookie fetch warning: {e}")

success_count = 0
for url, path in URLS:
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        success_count += 1
        continue
    try:
        time.sleep(1.2)
        r = session.get(url, timeout=15)
        if r.status_code == 200 and len(r.content) > 1000:
            with open(path, "wb") as f:
                f.write(r.content)
            success_count += 1
            print(f"Downloaded: {path} ({len(r.content)} bytes)")
        else:
            print(f"Failed {url}: status {r.status_code}")
    except Exception as e:
        print(f"Error {url}: {e}")

print(f"Total downloaded / available: {success_count}/{len(URLS)}")
