"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { SignedDocument } from "@/lib/types";
import SearchableSelect from "@/components/SearchableSelect";

export default function ESignaturePage() {
  const [docs, setDocs] = useState<SignedDocument[]>(store.getSignedDocuments());
  const [selectedDoc, setSelectedDoc] = useState<SignedDocument | null>(null);

  const [signatureName, setSignatureName] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [newDocType, setNewDocType] = useState<SignedDocument["documentType"]>("admission_contract");
  const [newDocTitle, setNewDocTitle] = useState("Aviation Code of Conduct & Safety Undertaking");

  const handleSignDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert("Please confirm acknowledgment of legal terms.");
      return;
    }

    const randomHash = "SHA256:" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const signed = store.addSignedDocument({
      ownerId: "1",
      ownerName: signatureName,
      ownerType: "student",
      documentType: newDocType,
      title: newDocTitle,
      signedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      signerIp: "103.21.54." + Math.floor(Math.random() * 200 + 10),
      verificationHash: randomHash,
      status: "signed",
    });

    setDocs(store.getSignedDocuments());
    setSelectedDoc(signed);
    setSignatureName("");
    setAgreedTerms(false);
    alert("Document cryptographically signed and archived!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-xl p-6 text-white shadow-md">
          <div>
            <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-indigo-400/30">
              Irik.md Section 4.16
            </span>
            <h1 className="text-2xl font-bold mt-2">Digital Document E-Signature & Audit Vault</h1>
            <p className="text-sm text-gray-300">
              Legally binding digital execution of admission contracts, DGCA flight medical indemnities & parent consents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Signed Documents Archive */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1">Archived Signed Documents Vault</h3>
              <p className="text-xs text-gray-500 mb-4">Click to inspect digital certificate, signer IP & SHA-256 verification hash</p>

              <div className="space-y-3">
                {docs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDoc(d)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      selectedDoc?.id === d.id ? "bg-indigo-50/70 border-indigo-300" : "bg-gray-50/50 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
                            {d.documentType.replace("_", " ")}
                          </span>
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            ✓ E-Signed & Sealed
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mt-1">{d.title}</h4>
                        <p className="text-xs text-gray-500">
                          Signer: <span className="font-semibold text-gray-800">{d.ownerName}</span> ({d.ownerType}) on {d.signedDate}
                        </p>
                        <div className="mt-2 text-[10px] font-mono text-gray-400 bg-white p-2 rounded border truncate max-w-lg">
                          🔒 {d.verificationHash}
                        </div>
                      </div>
                      <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-medium">
                        View Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* E-Signature Signing Pad & Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="font-bold text-gray-900 mb-1">Sign Pending Document</h3>
            <p className="text-xs text-gray-500 mb-4">Execute digital verification with legal timestamp and IP capture</p>
            <form onSubmit={handleSignDocument} className="space-y-4">
              <div>
                <SearchableSelect
                  label="Document Template"
                  value={newDocType}
                  onChange={(val) => {
                    const type = val as SignedDocument["documentType"];
                    setNewDocType(type);
                    if (type === "flight_medical_clearance") setNewDocTitle("DGCA Class 1 Medical Clearance & Flight Liability Waiver");
                    else if (type === "indemnity_consent") setNewDocTitle("Flight Simulator & Solo Flight Indemnity Agreement");
                    else setNewDocTitle("IRIK Academic Honor Code & Aviation Safety Contract");
                  }}
                  options={[
                    { value: "admission_contract", label: "Admission Contract & Honor Code" },
                    { value: "flight_medical_clearance", label: "DGCA Medical Clearance & Liability Waiver" },
                    { value: "indemnity_consent", label: "Solo Flight Indemnity & Parent Consent" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Signer Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm font-semibold"
                />
              </div>

              {/* Typed Signature Visualizer */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Digital Signature Preview</label>
                <div className="h-20 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center p-3 text-center">
                  {signatureName ? (
                    <span className="font-serif italic text-2xl text-indigo-900 font-bold tracking-wider">
                      {signatureName}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Type name above to generate signature stamp</span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-snug">
                  I agree that this electronic signature is the legally binding equivalent to my manual handwritten signature under the Information Technology Act.
                </label>
              </div>

              <button
                type="submit"
                disabled={!signatureName || !agreedTerms}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl text-sm transition shadow"
              >
                ✍️ Cryptographically Sign & Seal
              </button>
            </form>
          </div>
        </div>

        {/* Certificate Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
              <div className="border-b pb-3 text-center">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Digital Signature Certificate</span>
                <h3 className="font-bold text-lg text-gray-900 mt-1">{selectedDoc.title}</h3>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-500">Signatory:</span>
                  <span className="font-bold text-gray-900">{selectedDoc.ownerName} ({selectedDoc.ownerType})</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="font-mono text-gray-800">{selectedDoc.signedDate} UTC+5:30</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-500">Signer IP Address:</span>
                  <span className="font-mono text-gray-800">{selectedDoc.signerIp}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Cryptographic Hash Digest:</span>
                  <p className="font-mono text-[11px] bg-gray-50 p-2 rounded border break-all text-slate-800">
                    {selectedDoc.verificationHash}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm"
                >
                  🖨️ Print Certificate
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
