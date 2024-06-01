async function startScanning() {
  const ndef = new NDEFReader();
  console.log(ndef);
  try {
    await ndef.scan();
    document.getElementById("status").textContent = "Status: Scanning...";

    ndef.onreading = (event) => {
      const uid = event.serialNumber;
      document.getElementById("uid").textContent = `UID: ${uid}`;
      document.getElementById("status").textContent = "Status: UID Read";
    };
  } catch (error) {
    console.error("Error: ", error);
    document.getElementById(
      "status"
    ).textContent = `Status: Error - ${error.message}`;
  }
}

async function checkNFCPermission() {
  try {
    const nfcPermissionStatus = await navigator.permissions.query({
      name: "nfc",
    });

    if (nfcPermissionStatus.state === "granted") {
      console.log("granted");
      startScanning();
    } else if (nfcPermissionStatus.state === "prompt") {
      startScanning(); // This will trigger the permission prompt.
    } else if (nfcPermissionStatus.state === "denied") {
      alert(`NFC access is denied. To enable it, please follow these steps:
            1. Open Chrome settings.
            2. Navigate to 'Site settings'.
            3. Find and select 'NFC'.
            4. Change the permission to 'Allow' for this site.

            After doing this, click the 'Start NFC Scan' button again.`);
      document.getElementById("status").textContent =
        "NFC access is denied. Please enable it in the browser settings.";
    }

    nfcPermissionStatus.onchange = () => {
      if (nfcPermissionStatus.state === "granted") {
        startScanning();
      } else {
        console.log(
          `NFC permission state changed to: ${nfcPermissionStatus.state}`
        );
      }
    };
  } catch (error) {
    console.log("Argh! " + error);
  }
}

document.getElementById("scanButton").addEventListener("click", () => {
  console.log("User clicked scan button");
  checkNFCPermission();
});
