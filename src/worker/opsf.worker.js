/* eslint-disable no-restricted-globals */
const _accessHandle = new Promise(async (r) => {
  const opfsRoot = await navigator.storage.getDirectory();
  const fileHandle = await opfsRoot.getFileHandle("ipfs_test", {
    create: true,
  });
  const privateFileHandle = await opfsRoot.getFileHandle("ipfs_private", {
    create: true,
  });
  const accessHandle = await fileHandle.createSyncAccessHandle();
  const privateAccessHandle = await privateFileHandle.createSyncAccessHandle();
  r([accessHandle, privateAccessHandle]);
});
async function read() {
  const [accessHandle, privateAccessHandle] = await _accessHandle;
  const fileSize = accessHandle.getSize();
  const privateFileSize = privateAccessHandle.getSize();
  if (fileSize === 0) {
    postMessage(undefined);
    return;
  }

  const buffer = new DataView(new ArrayBuffer(fileSize));
  const privBuffer = new DataView(new ArrayBuffer(privateFileSize));
  accessHandle.read(buffer, { at: 0 });
  privateAccessHandle.read(privBuffer, { at: 0 });
  const result = { peerId: buffer, privateKey: privBuffer };
  postMessage(result);
}

async function write(id, key) {
  const [accessHandle, privateAccessHandle] = await _accessHandle;
  await Promise.all([
    accessHandle.write(id, { at: 0 }),
    privateAccessHandle.write(key, { at: 0 }),
  ]);
  await Promise.all([accessHandle.flush(), privateAccessHandle.flush()]);
  postMessage(true);
}

self.onmessage = ({ data: _data }) => {
  const { type, data, privKey } = _data;
  if (type === "read") {
    read();
  } else if (type === "write") {
    write(data, privKey);
  }
};
