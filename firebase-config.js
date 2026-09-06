// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// আপনার দেওয়া ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyBmLstWBNAT2fxqZj_WmVoQyLgmXQjSjWE",
  authDomain: "parvez-app-gallery.firebaseapp.com",
  databaseURL: "https://parvez-app-gallery-default-rtdb.firebaseio.com",
  projectId: "parvez-app-gallery",
  storageBucket: "parvez-app-gallery.firebasestorage.app",
  messagingSenderId: "186454295571",
  appId: "1:186454295571:web:111b561f7365932a826be6",
  measurementId: "G-20GK999V62"
};

// ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * এক্সেস কন্ট্রোল ফাংশন
 * এটি চেক করবে ইউজার লগইন আছে কিনা এবং তার সঠিক রোল (mso/chemist) আছে কিনা।
 */
export function checkAccess(requiredRole) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // যদি লগইন না থাকে এবং বর্তমান পেজটি ইনডেক্স না হয়, তবে লগইনে পাঠাবে
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname.includes('qr-scanner.html') &&
                !window.location.pathname.includes('chemist-dashboard.html')) {
                window.location.href = 'index.html';
            }
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // লোকাল স্টোরেজে তথ্য আপডেট করা
                localStorage.setItem('userUid', user.uid);
                localStorage.setItem('userRole', userData.role);

                // রোল চেক করা (যদি এমএসও পেজে অন্য কেউ ঢুকতে চায়)
                if (requiredRole && userData.role !== requiredRole) {
                    alert("আপনার এই পেজটি দেখার অনুমতি নেই!");
                    window.location.href = 'index.html';
                }
            }
        } catch (error) {
            console.error("Access Error:", error);
        }
    });
}

/**
 * লগআউট ফাংশন
 */
export function handleLogout() {
    signOut(auth).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

export { auth, db, signInWithEmailAndPassword };