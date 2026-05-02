import React from "react";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">

            <div className="absolute inset-0" onClick={onCancel} />

            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-slate-100">

                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
                    Confirm Logout
                </h2>
                <p className="text-slate-500 text-sm text-center mb-8">
                    Are you sure you want to log out?
                </p>
                
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-red-700 via-red-600 to-black text-white font-semibold hover:opacity-90 transition-all shadow-md"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LogoutModal;