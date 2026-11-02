"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { 
  Printer, 
  Share2, 
  Plus, 
  Trash2, 
  Store, 
  Upload, 
  User, 
  FileSpreadsheet, 
  Receipt, 
  QrCode, 
  Coins, 
  MapPin, 
  Save, 
  CheckCircle2, 
  Wallet, 
  MessageSquare, 
  ArrowDownLeft,
  ArrowUpRight,
  LogIn,
  LogOut,
  UserPlus,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  X
} from "lucide-react";

interface LineItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
  amount: number;
}

interface ShopUser {
  id: string;
  mobile: string;
  password: string;
  businessName: string;
  businessType: string;
  proprietorName: string;
  phone: string;
  shopNumber: string;
  marketName: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  upiId: string;
  customQrImage?: string | null;
}

export default function KhatabookMultiShopSystem() {
  const [mounted, setMounted] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // ================= MULTI-DUKAAN AUTH STATES =================
  const [currentUser, setCurrentUser] = useState<ShopUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [authError, setAuthError] = useState("");

  // Password Visibility Toggle (Show / Hide)
  const [showPassword, setShowPassword] = useState(false);

  // Auth Form Fields
  const [authMobile, setAuthMobile] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regShopName, setRegShopName] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regUpi, setRegUpi] = useState("");

  // Real Date & Live Time
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  // Format
  const [printFormat, setPrintFormat] = useState<"A4" | "THERMAL">("A4");

  // Default Fallback Dukaan Profile
  const defaultOwner: ShopUser = {
    id: "default-1",
    mobile: "9876543210",
    password: "123",
    businessName: "Radha Krishna Supermarket",
    businessType: "Grocery, Dairy & General Store",
    proprietorName: "Rakesh Sharma",
    phone: "9876543210",
    shopNumber: "Shop No. 12, Ground Floor",
    marketName: "Krishna Complex, Station Road",
    landmark: "Near SBI Bank & Main Bus Stand",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    gstin: "08AABCR1234B1Z5",
    bankName: "State Bank of India",
    accountNo: "309812345678",
    ifscCode: "SBIN0001234",
    upiId: "9876543210@paytm",
    customQrImage: null,
  };

  const [owner, setOwner] = useState<ShopUser>(defaultOwner);
  const [customQrImage, setCustomQrImage] = useState<string | null>(null);
  const [qrType, setQrType] = useState<"UPI_AUTO" | "UPLOAD_IMAGE">("UPI_AUTO");

  // Customer Details
  const [customer, setCustomer] = useState({
    name: "Vikram Malhotra",
    phone: "9820098200",
    address: "Flat 204, Green Heights, Tonk Road",
    city: "Jaipur",
    previousDue: 0,
  });

  // Items
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", name: "Fortune Sunflower Oil (1 Litre)", hsn: "1512", qty: 2, rate: 165, gstRate: 5, amount: 330 },
    { id: "2", name: "Aashirvaad Shudh Chakki Atta (10 Kg)", hsn: "1101", qty: 1, rate: 420, gstRate: 5, amount: 420 },
    { id: "3", name: "Detergent Powder (2 Kg Pack)", hsn: "3402", qty: 1, rate: 280, gstRate: 18, amount: 280 },
  ]);

  // Discount & Settlement
  const [discountType, setDiscountType] = useState<"FLAT" | "PERCENT">("FLAT");
  const [discountValue, setDiscountValue] = useState<number>(30);
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "SPLIT" | "KHATA">("CASH");
  const [amountReceived, setAmountReceived] = useState<number>(1000);

  // Initialize System
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentDate(now.toISOString().split("T")[0]);
    setCurrentTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
    setInvoiceNo(`KB${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${Math.floor(100 + Math.random() * 900)}`);

    try {
      const activeSession = localStorage.getItem("billgenius_active_user");
      if (activeSession) {
        const user: ShopUser = JSON.parse(activeSession);
        setCurrentUser(user);
        setOwner(user);
        if (user.customQrImage) {
          setCustomQrImage(user.customQrImage);
          setQrType("UPLOAD_IMAGE");
        }
      }
    } catch {
      // Storage fallback
    }
  }, []);

  const getAllRegisteredShops = (): ShopUser[] => {
    try {
      const data = localStorage.getItem("billgenius_all_shops");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // 1. DUKAANDAAR SIGN UP
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authMobile || !authPassword || !regShopName) {
      setAuthError("Mobile Number, Password aur Dukaan Ka Naam zaroori hai!");
      return;
    }

    const allShops = getAllRegisteredShops();
    const existing = allShops.find((s) => s.mobile === authMobile.trim());
    if (existing) {
      setAuthError("Yeh mobile number pehle se registered hai! Kripya Login karein.");
      return;
    }

    const newShop: ShopUser = {
      id: "shop_" + Date.now(),
      mobile: authMobile.trim(),
      password: authPassword.trim(),
      businessName: regShopName.trim(),
      businessType: "General Store / Retail",
      proprietorName: regName.trim() || "Owner",
      phone: authMobile.trim(),
      shopNumber: "Shop No. 1",
      marketName: "Main Market",
      landmark: "Near Main Chowk",
      city: regCity.trim() || "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      gstin: "",
      bankName: "State Bank of India",
      accountNo: "",
      ifscCode: "",
      upiId: regUpi.trim() || `${authMobile.trim()}@paytm`,
      customQrImage: null,
    };

    allShops.push(newShop);
    localStorage.setItem("billgenius_all_shops", JSON.stringify(allShops));
    localStorage.setItem("billgenius_active_user", JSON.stringify(newShop));

    setCurrentUser(newShop);
    setOwner(newShop);
    setAuthModalOpen(false);
    alert(`Badhai ho! "${newShop.businessName}" safaltapoorvak register ho gayi!`);
  };

  // 2. DUKAANDAAR LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const allShops = getAllRegisteredShops();
    const found = allShops.find(
      (s) => s.mobile === authMobile.trim() && s.password === authPassword.trim()
    );

    if (found) {
      setCurrentUser(found);
      setOwner(found);
      if (found.customQrImage) {
        setCustomQrImage(found.customQrImage);
        setQrType("UPLOAD_IMAGE");
      }
      localStorage.setItem("billgenius_active_user", JSON.stringify(found));
      setAuthModalOpen(false);
      setAuthMobile("");
      setAuthPassword("");
    } else {
      setAuthError("Mobile Number ya Password galat hai!");
    }
  };

  // 3. DUKAANDAAR LOGOUT
  const handleLogout = () => {
    if (confirm("Kya aap apna account logout karna chahte hain?")) {
      localStorage.removeItem("billgenius_active_user");
      setCurrentUser(null);
      setOwner(defaultOwner);
      setCustomQrImage(null);
      setQrType("UPI_AUTO");
      alert("Aapka account logout ho gaya hai.");
    }
  };

  const saveActiveDukaanProfile = () => {
    const updatedOwner = { ...owner, customQrImage: customQrImage || null };
    setOwner(updatedOwner);

    if (currentUser) {
      const allShops = getAllRegisteredShops();
      const updatedList = allShops.map((s) => s.id === currentUser.id ? updatedOwner : s);
      localStorage.setItem("billgenius_all_shops", JSON.stringify(updatedList));
      localStorage.setItem("billgenius_active_user", JSON.stringify(updatedOwner));
      setCurrentUser(updatedOwner);
    } else {
      localStorage.setItem("billgenius_active_user", JSON.stringify(updatedOwner));
    }

    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3500);
  };

  const handleQrUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomQrImage(result);
        setQrType("UPLOAD_IMAGE");
      };
      reader.readAsDataURL(file);
    }
  };

  const fullShopAddress = `${owner.shopNumber}, ${owner.marketName}, Landmark: ${owner.landmark}, ${owner.city}, ${owner.state} - ${owner.pincode}`;

  // Mathematical Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = discountType === "PERCENT" 
    ? (subtotal * discountValue) / 100 
    : Number(discountValue || 0);

  const taxable = Math.max(0, subtotal - discountAmount);

  const totalGst = items.reduce((sum, item) => {
    const ratio = subtotal > 0 ? (taxable / subtotal) : 1;
    const itemNet = item.amount * ratio;
    return sum + (itemNet * item.gstRate) / 100;
  }, 0);

  const grandTotal = Math.max(0, taxable + totalGst + Number(customer.previousDue || 0));
  const received = Number(amountReceived || 0);
  const remainingDue = Math.max(0, grandTotal - received);
  const changeToReturn = Math.max(0, received - grandTotal);
  const paymentStatus = remainingDue === 0 ? "PAID" : received === 0 ? "UNPAID (UDHAAR)" : "PARTIALLY PAID";

  // Item Updates
  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems(items.map(it => {
      if (it.id === id) {
        const updated = { ...it, [field]: val };
        if (field === "qty" || field === "rate") {
          updated.amount = Number(updated.qty) * Number(updated.rate);
        }
        return updated;
      }
      return it;
    }));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "Naya Product / Item", hsn: "9983", qty: 1, rate: 100, gstRate: 5, amount: 100 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(it => it.id !== id));
  };

  // NPCI Clean UPI QR Code
  const cleanPayeeName = owner.businessName.replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 25);
  const cleanUpiId = owner.upiId.trim();
  const upiPayableAmount = (remainingDue > 0 ? remainingDue : grandTotal).toFixed(2);
  const npciUpiString = `upi://pay?pa=${cleanUpiId}&pn=${encodeURIComponent(cleanPayeeName)}&am=${upiPayableAmount}&cu=INR`;
  const generatedUpiQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(npciUpiString)}`;
  const finalQrSource = (qrType === "UPLOAD_IMAGE" && customQrImage) ? customQrImage : generatedUpiQr;

  // Dispatchers
  const sendWhatsAppBill = () => {
    if (!customer.phone) {
      alert("Customer mobile number enter karein!");
      return;
    }
    const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
    const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const msg = `🧾 *KHATABOOK DIGITAL BILL*\n` +
      `🏪 *${owner.businessName}*\n` +
      `📍 ${fullShopAddress}\n` +
      `--------------------------------\n` +
      `👤 *Grahak:* ${customer.name}\n` +
      `📄 *Bill No:* ${invoiceNo}\n` +
      `📅 *Date:* ${currentDate} (${currentTime})\n` +
      `--------------------------------\n` +
      `💵 *Kul Bill (Total):* ₹${grandTotal.toFixed(2)}\n` +
      `🟢 *Jama Kiya (Paid - ${paymentMode}):* ₹${received.toFixed(2)}\n` +
      `${remainingDue > 0 ? `🔴 *Baqi Udhaar (Due):* ₹${remainingDue.toFixed(2)}\n` : `✅ *Hisab Barabar (Full Paid)*\n`}` +
      `${remainingDue > 0 ? `\n💳 *Online Payment Link (UPI):*\n${npciUpiString}\n` : ``}` +
      `--------------------------------\n` +
      `📞 *Dukaan Contact:* ${owner.phone}\n` +
      `Dhanyawad! Hamari dukaan par dobara zaroor aayein.`;

    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const sendSMSBill = () => {
    if (!customer.phone) {
      alert("Customer mobile number enter karein!");
      return;
    }
    const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
    const msg = `Dear ${customer.name}, aapka bill ready hai from ${owner.businessName}. Bill No: ${invoiceNo}, Total: Rs ${grandTotal.toFixed(2)}, Jama: Rs ${received.toFixed(2)}, Baqi Udhaar: Rs ${remainingDue.toFixed(2)}. Pay: ${npciUpiString}. Dukaan: ${owner.marketName}, ${owner.city}. Ph: ${owner.phone}`;
    window.open(`sms:${cleanPhone}?body=${encodeURIComponent(msg)}`, "_self");
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-medium">Loading Khatabook Engine...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans antialiased">
      
      {/* ================= TOP PRO NAVBAR ================= */}
      <header className="no-print bg-[#0F172A] text-white px-5 md:px-8 py-3.5 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 shadow-xl border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 bg-gradient-to-tr from-rose-600 to-red-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-rose-600/30">
            KB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white">{owner.businessName}</span>
              {currentUser ? (
                <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Verified Dukaan
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
              📍 {owner.marketName}, {owner.city}
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold shadow-inner">
            <button
              onClick={() => setPrintFormat("A4")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                printFormat === "A4" ? "bg-rose-600 text-white shadow-md font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> A4 Tax
            </button>
            <button
              onClick={() => setPrintFormat("THERMAL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                printFormat === "THERMAL" ? "bg-rose-600 text-white shadow-md font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> 80mm Slip
            </button>
          </div>

          <button
            onClick={sendWhatsAppBill}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02]"
          >
            <Share2 className="w-3.5 h-3.5" /> WhatsApp
          </button>

          <button
            onClick={sendSMSBill}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-blue-950/20 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-3.5 h-3.5" /> SMS
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-800" /> Print
          </button>

          {/* DUKAANDAAR LOGIN / LOGOUT */}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" /> Logout ({currentUser.proprietorName.split(" ")[0]})
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthTab("LOGIN");
                setAuthError("");
                setShowPassword(false);
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-rose-600/30 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" /> Dukaan Login / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* ================= AUTHENTICATION MODAL WITH SHOW/HIDE PASSWORD ================= */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 mb-5">
              <button
                onClick={() => { setAuthTab("LOGIN"); setAuthError(""); setShowPassword(false); }}
                className={`flex-1 pb-3 font-extrabold text-sm border-b-2 transition flex items-center justify-center gap-2 ${
                  authTab === "LOGIN" ? "border-rose-600 text-rose-600" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <LogIn className="w-4 h-4" /> Dukandaar Login
              </button>
              <button
                onClick={() => { setAuthTab("SIGNUP"); setAuthError(""); setShowPassword(false); }}
                className={`flex-1 pb-3 font-extrabold text-sm border-b-2 transition flex items-center justify-center gap-2 ${
                  authTab === "SIGNUP" ? "border-rose-600 text-rose-600" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <UserPlus className="w-4 h-4" /> Nayi Dukaan Register
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span> {authError}
              </div>
            )}

            {authTab === "LOGIN" ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dukandaar Mobile Number:</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={authMobile}
                      onChange={(e) => setAuthMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* PASSWORD FIELD WITH SHOW/HIDE EYE BUTTON */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Password:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Apna password daalein"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-11 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition"
                    />
                    {/* EYE TOGGLE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black py-2.5 rounded-xl text-xs shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.01]"
                >
                  Login Karein (Dukaan Kholein)
                </button>
                <p className="text-[11px] text-slate-400 text-center pt-1">
                  Pehli baar aaye hain? Upar <b>"Nayi Dukaan Register"</b> par click karein.
                </p>
              </form>
            ) : (
              /* SIGNUP / REGISTER FORM */
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">Dukaan / Store Ka Naam *</label>
                  <input
                    required
                    value={regShopName}
                    onChange={(e) => setRegShopName(e.target.value)}
                    placeholder="e.g. Shri Balaji Kirana & Sweets"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">Dukandaar Ka Naam</label>
                    <input
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ramesh Kumar"
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">Shahar / City</label>
                    <input
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="Jaipur / Delhi"
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">Mobile No (Login ID) *</label>
                    <input
                      required
                      value={authMobile}
                      onChange={(e) => setAuthMobile(e.target.value)}
                      placeholder="9876543210"
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
                    />
                  </div>

                  {/* SIGNUP PASSWORD FIELD WITH EYE BUTTON */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">Password *</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Apna password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-2.5 pr-8 py-1.5 text-xs text-slate-900 outline-none focus:border-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 p-0.5 rounded"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">Dukaan UPI ID (QR Code Ke Liye)</label>
                  <input
                    value={regUpi}
                    onChange={(e) => setRegUpi(e.target.value)}
                    placeholder="9876543210@paytm"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-blue-600 outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black py-2.5 rounded-xl text-xs shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.01] mt-2"
                >
                  Nayi Dukaan Create Karein
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MAIN WORKSPACE ================= */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT CONFIGURATION PANEL (5 Cols) ================= */}
        <div className="no-print lg:col-span-5 space-y-6">
          
          {/* MODERN KHATABOOK LEDGER STATS (JAMA VS UDHAAR) */}
          <div className="grid grid-cols-2 gap-4">
            {/* You Got / Jama */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-700"><ArrowDownLeft className="w-3.5 h-3.5" /></span> You Got (Jama)
                </span>
                <p className="text-2xl font-black font-mono text-emerald-600 mt-1">₹{received.toFixed(2)}</p>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">Payment Mode: {paymentMode}</span>
              </div>
            </div>

            {/* You Gave / Udhaar */}
            <div className="bg-gradient-to-br from-rose-50/80 to-white p-4 rounded-2xl border border-rose-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="p-1 rounded-md bg-rose-100 text-rose-700"><ArrowUpRight className="w-3.5 h-3.5" /></span> You Gave (Udhaar)
                </span>
                <p className="text-2xl font-black font-mono text-rose-600 mt-1">₹{remainingDue.toFixed(2)}</p>
                <span className={`text-[10px] font-extrabold mt-0.5 block ${remainingDue === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {remainingDue === 0 ? "✓ Hisab Barabar" : "● Baqi Udhaar"}
                </span>
              </div>
            </div>
          </div>

          {/* 1. DUKAAN PROFILE & EXACT LOCATION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" /> {owner.businessName} (Dukaan Profile)
                </h3>
                <p className="text-[11px] text-slate-400">Pata aur location yahan se update karein</p>
              </div>
              <button
                onClick={saveActiveDukaanProfile}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>

            {savedSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Dukaan details account mein successfully update ho gayi hain!
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <input
                value={owner.businessName}
                onChange={(e) => setOwner({ ...owner, businessName: e.target.value })}
                placeholder="Dukaan Ka Naam"
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-rose-500"
              />
              <input
                value={owner.shopNumber}
                onChange={(e) => setOwner({ ...owner, shopNumber: e.target.value })}
                placeholder="Shop No"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
              />
              <input
                value={owner.marketName}
                onChange={(e) => setOwner({ ...owner, marketName: e.target.value })}
                placeholder="Market / Complex"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
              />
              <input
                value={owner.landmark}
                onChange={(e) => setOwner({ ...owner, landmark: e.target.value })}
                placeholder="Landmark (Near SBI / Mandir Ke Samne)"
                className="col-span-2 bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                value={owner.city}
                onChange={(e) => setOwner({ ...owner, city: e.target.value })}
                placeholder="City"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
              />
              <input
                value={owner.phone}
                onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                placeholder="Dukaan Phone"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* 2. PAYMENT & CASH SETTLEMENT */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" /> Payment & Hisab-Kitab
              </h3>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                paymentStatus === "PAID" 
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                  : remainingDue > 0 
                  ? "bg-rose-100 text-rose-800 border border-rose-200" 
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}>
                ● {paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-extrabold">
              {[
                { id: "CASH", label: "💵 Cash" },
                { id: "UPI", label: "📱 UPI" },
                { id: "SPLIT", label: "⚡ Mix" },
                { id: "KHATA", label: "📒 Udhaar" }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setPaymentMode(mode.id as any);
                    if (mode.id === "KHATA") setAmountReceived(0);
                    if (mode.id === "CASH" || mode.id === "UPI") setAmountReceived(grandTotal);
                  }}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    paymentMode === mode.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Grahak Se Kitne Paise Mile (₹):</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setAmountReceived(grandTotal)}
                    className="text-[10px] bg-white border border-slate-200 hover:bg-emerald-50 px-2 py-0.5 rounded-lg font-bold shadow-2xs"
                  >
                    Exact ₹{grandTotal.toFixed(0)}
                  </button>
                  <button
                    onClick={() => setAmountReceived(500)}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-semibold shadow-2xs"
                  >
                    ₹500
                  </button>
                  <button
                    onClick={() => setAmountReceived(1000)}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg font-semibold shadow-2xs"
                  >
                    ₹1000
                  </button>
                </div>
              </div>

              <input
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />

              {changeToReturn > 0 ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex justify-between items-center">
                  <span>Khulle Wapas Lautane Hain (Change):</span>
                  <span className="font-mono text-sm">₹{changeToReturn.toFixed(2)}</span>
                </div>
              ) : remainingDue > 0 ? (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex justify-between items-center">
                  <span>Baqi Udhaar (You Gave):</span>
                  <span className="font-mono text-sm">₹{remainingDue.toFixed(2)}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* 3. DISCOUNT & UPI SETUP */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-rose-600" /> Discount (Chhoot)
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setDiscountType("FLAT")}
                    className={`px-2 py-0.5 rounded-md ${discountType === "FLAT" ? "bg-white shadow text-rose-600" : "text-slate-500"}`}
                  >
                    Flat ₹
                  </button>
                  <button
                    onClick={() => setDiscountType("PERCENT")}
                    className={`px-2 py-0.5 rounded-md ${discountType === "PERCENT" ? "bg-white shadow text-rose-600" : "text-slate-500"}`}
                  >
                    %
                  </button>
                </div>
              </div>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-rose-500"
              />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase block">Dukaan UPI ID:</label>
              <input
                type="text"
                value={owner.upiId}
                onChange={(e) => setOwner({ ...owner, upiId: e.target.value })}
                placeholder="9876543210@paytm"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-blue-600 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 4. GRAHAK DETAILS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600" /> Grahak Khata (Customer Details)
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <input
                placeholder="Grahak Ka Naam"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-rose-500"
              />
              <input
                placeholder="Mobile (WhatsApp & SMS)"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 outline-none focus:border-rose-500"
              />
              <input
                placeholder="Grahak Ka Pata / Colony"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* 5. ITEMS EDITOR */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Cart Items ({items.length})
              </h3>
              <button
                onClick={addItem}
                className="text-xs text-rose-600 font-extrabold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Item Jodein
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <input
                    type="text"
                    value={item.name}
                    placeholder="Product name"
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="flex-1 bg-transparent font-medium text-slate-900 outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                    className="w-12 bg-white border border-slate-200 rounded-lg px-1 py-1 text-center font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="w-16 bg-white border border-slate-200 rounded-lg px-1 py-1 text-right font-mono"
                  />
                  <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT LIVE INVOICE CANVAS (7 Cols) ================= */}
        <div className="lg:col-span-7 flex justify-center items-start">
          
          {printFormat === "A4" ? (
            /* ================= KHATABOOK A4 TAX INVOICE ================= */
            <div
              id="printable-document"
              className="w-full bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 min-h-[920px] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-rose-600 rounded text-white font-black text-xs flex items-center justify-center">
                        KB
                      </div>
                      <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">{owner.businessName}</h1>
                    </div>
                    <p className="text-xs font-semibold text-rose-600 mt-0.5">{owner.businessType}</p>
                    
                    <div className="mt-2 space-y-0.5 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{owner.shopNumber}, {owner.marketName}</span>
                      </p>
                      <p className="pl-4 font-medium text-amber-800">Landmark: {owner.landmark}</p>
                      <p className="pl-4">{owner.city}, {owner.state} - {owner.pincode}</p>
                      <p className="pl-4 text-slate-600 font-mono mt-0.5">Phone: {owner.phone} | Prop: {owner.proprietorName}</p>
                    </div>

                    {owner.gstin && (
                      <p className="text-xs font-bold font-mono text-slate-900 mt-1 pl-4">GSTIN: {owner.gstin}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded tracking-wider uppercase mb-1">
                      TAX INVOICE
                    </span>
                    <p className="text-lg font-mono font-bold text-slate-900">{invoiceNo}</p>
                    <p className="text-xs text-slate-700 font-medium">Date: {currentDate}</p>
                    <p className="text-xs text-slate-500 font-mono">Time: {currentTime}</p>
                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded border ${
                      paymentStatus === "PAID" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300" 
                        : "bg-rose-50 text-rose-700 border-rose-300"
                    }`}>
                      STATUS: {paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Grahak & QR Box */}
                <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Billed To (Grahak):</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{customer.name}</p>
                    <p className="text-xs text-slate-600">{customer.address}, {customer.city}</p>
                    <p className="text-xs text-slate-600 font-mono">Mobile: {customer.phone}</p>
                  </div>

                  <div className="flex justify-end items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-800 block">Scan to Pay via UPI</span>
                      <span className="text-[10px] text-slate-500 block">
                        {remainingDue > 0 ? `Pay Pending: ₹${remainingDue.toFixed(2)}` : "Pay Exact Amount"}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-600 block mt-0.5">{cleanUpiId}</span>
                    </div>
                    <div className="p-1 bg-white border-2 border-slate-900 rounded-lg shadow-sm">
                      <img
                        src={finalQrSource}
                        alt="QR Code"
                        className="w-20 h-20 object-contain block"
                      />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="py-6">
                  <table className="w-full text-xs table-fixed">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-slate-700 font-bold">
                        <th className="pb-2 w-[6%] text-center">#</th>
                        <th className="pb-2 w-[58%] text-left">ITEM NAME / DESCRIPTION</th>
                        <th className="pb-2 w-[10%] text-center">QTY</th>
                        <th className="pb-2 w-[12%] text-right">RATE (₹)</th>
                        <th className="pb-2 w-[14%] text-right">AMOUNT (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.map((item, idx) => (
                        <tr key={item.id} className="align-middle">
                          <td className="py-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-3 text-left font-semibold text-slate-900 truncate pr-2">{item.name}</td>
                          <td className="py-3 text-center font-mono font-bold">{item.qty}</td>
                          <td className="py-3 text-right font-mono text-slate-700">{item.rate.toFixed(2)}</td>
                          <td className="py-3 text-right font-mono font-black text-slate-900">{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Settlement Summary */}
              <div>
                <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-start">
                  <div className="text-xs space-y-1 text-slate-600 max-w-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-900">Khatabook Hisab Summary:</p>
                    <p>Payment Mode: <span className="font-bold text-slate-900">{paymentMode}</span></p>
                    <p className="text-emerald-700 font-bold">You Got (Jama): ₹{received.toFixed(2)}</p>
                    {remainingDue > 0 ? (
                      <p className="text-rose-700 font-bold">
                        You Gave (Udhaar): ₹{remainingDue.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-emerald-700 font-semibold">✓ Hisab Barabar (Zero Due)</p>
                    )}
                    {changeToReturn > 0 && (
                      <p className="text-slate-700 font-medium">Khulle Wapas: ₹{changeToReturn.toFixed(2)}</p>
                    )}
                  </div>

                  <div className="w-64 space-y-1.5 text-xs text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount:</span>
                        <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Total GST:</span>
                      <span className="font-mono">+₹{totalGst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1.5">
                      <span>Grand Total:</span>
                      <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black border-t-2 border-slate-900 pt-1.5">
                      <span className={remainingDue > 0 ? "text-rose-600" : "text-emerald-600"}>
                        {remainingDue > 0 ? "Baqi Udhaar:" : "Baqi Due:"}
                      </span>
                      <span className={`font-mono ${remainingDue > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        ₹{remainingDue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* All Rights Reserved Footer */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <p>© {new Date().getFullYear()} {owner.businessName}. All Rights Reserved. • Computer Generated Invoice</p>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">For {owner.businessName}</p>
                    <p className="text-[10px] text-slate-400 mt-4">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= 80MM THERMAL SLIP ================= */
            <div
              id="printable-document"
              className="w-[340px] bg-white text-black p-4 rounded-xl shadow-xl border border-slate-300 font-mono text-[11px] leading-tight flex flex-col justify-between"
            >
              <div>
                <div className="text-center pb-2 border-b border-dashed border-black">
                  <p className="text-sm font-bold uppercase">{owner.businessName}</p>
                  <p className="text-[9px] font-bold text-slate-700">({owner.businessType})</p>
                  <p className="text-[10px] mt-1">{owner.shopNumber}, {owner.marketName}</p>
                  <p className="text-[9px] font-bold">Landmark: {owner.landmark}</p>
                  <p className="text-[10px]">{owner.city}, {owner.state} - {owner.pincode}</p>
                  <p className="text-[10px]">Ph: {owner.phone}</p>
                  {owner.gstin && <p className="text-[10px] font-bold mt-0.5">GSTIN: {owner.gstin}</p>}
                </div>

                <div className="py-2 border-b border-dashed border-black text-[10px]">
                  <div className="flex justify-between">
                    <span>BILL: {invoiceNo}</span>
                    <span>{currentDate}</span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span>TIME: {currentTime}</span>
                    <span className="font-bold">{paymentMode}</span>
                  </div>
                  <div>CUST: {customer.name} ({customer.phone})</div>
                </div>

                <div className="py-2 border-b border-dashed border-black">
                  <div className="flex justify-between font-bold border-b border-black pb-1 mb-1">
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>PRICE</span>
                  </div>
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between py-0.5">
                      <span className="truncate w-36">{it.name}</span>
                      <span>{it.qty}</span>
                      <span>{(it.qty * it.rate).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="py-2 space-y-1 text-right text-[11px]">
                  <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>DISCOUNT:</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST TAX:</span>
                    <span>₹{totalGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold border-t border-dashed border-black pt-1">
                    <span>TOTAL BILL:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>JAMA (PAID):</span>
                    <span>₹{received.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black border-t border-black pt-1 text-rose-700">
                    <span>{remainingDue > 0 ? "UDHAAR (DUE):" : "BALANCE:"}</span>
                    <span>₹{remainingDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Thermal Receipt Footer */}
              <div className="text-center pt-3 border-t border-dashed border-black">
                <p className="text-[10px] font-bold uppercase">
                  {remainingDue > 0 ? `Scan to Pay Udhaar: ₹${remainingDue.toFixed(2)}` : "Scan to Pay via UPI"}
                </p>
                <div className="p-1 bg-white border border-black inline-block mx-auto my-1">
                  <img
                    src={finalQrSource}
                    alt="QR"
                    className="w-28 h-28 object-contain"
                  />
                </div>
                <p className="text-[9px] font-bold font-mono">{cleanUpiId}</p>
                <p className="text-[9px] mt-1 text-slate-700">📍 Near: {owner.landmark}</p>
                <p className="text-[8px] text-slate-500 mt-2">© {new Date().getFullYear()} {owner.businessName}. All Rights Reserved.</p>
                <p className="text-[10px] font-bold mt-1">THANK YOU! VISIT AGAIN</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ================= WEBSITE FOOTER ================= */}
      <footer className="no-print mt-auto bg-[#0F172A] border-t border-slate-800 text-slate-400 py-6 px-6 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 bg-rose-600 rounded text-white font-black flex items-center justify-center text-[10px]">KB</span>
            <span className="font-bold text-white">BillGenius Pro </span>
            <span>• Multi-Talent Khatabook Billing Engine</span>
          </div>
          <p>© {new Date().getFullYear()} {owner.businessName}. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}