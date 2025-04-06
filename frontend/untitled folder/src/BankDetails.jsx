function BankDetails({ name, setName, bankName, setBankName, accountNo, setAccountNo, IFSC, setIFSC}) {
  return (
    <div className="flex flex-col text-base">
      <div className=" mt-10">
        <label>Enter Bank Details</label>
      </div>

      <div className=" mt-2">
        <label>Account Holder Name</label>
        <input type="text" className="bg-[#2E3944] border p-2 w-full" onChange={(e) => setName(e.target.value)} value={name} />
      </div>

      <div className=" mt-5">
        <label>Bank Name</label>
        <input type="text" className="bg-[#2E3944] border p-2 w-full" onChange={(e) => setBankName(e.target.value)} value={bankName} />
      </div>

      <div className=" mt-5">
        <label>Account No.</label>
        <input type="number" className="bg-[#2E3944] border p-2 w-full" onChange={(e) => setAccountNo(e.target.value)} value={accountNo} />
      </div>

      <div className=" mt-5">
        <label>IFSC Code</label>
        <input type="text" className="bg-[#2E3944]  border p-2 w-full" onChange={(e) => setIFSC(e.target.value)} value={IFSC} />
      </div>
    </div>
  );
}

export default BankDetails;
