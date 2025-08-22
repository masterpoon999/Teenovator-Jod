import React, { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { ref, set } from "firebase/database";

function MainPage() {
  const [isRegister, setIsRegister] = useState(true); // true = Register, false = Login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [idCard, setIdCard] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false); // เช็คว่า login สำเร็จหรือยัง
  const [state, setState] = useState(0); // state ของปุ่มเปิดปิด

  // สมัครสมาชิก
  const handleRegister = async () => {
    try {
      if (!/^\d{13}$/.test(idCard)) {
        alert("เลขบัตรประชาชนต้องมี 13 หลัก");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ บันทึกข้อมูลลง Realtime Database
      await set(ref(db, "users/" + user.uid), {
        fullName,
        phone,
        idCard,
        email,
        createdAt: new Date().toISOString()
      });

      alert("สมัครสมาชิกสำเร็จ!");
      setIsRegister(false); // ไปหน้า Login
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("อีเมลนี้ถูกใช้สมัครไปแล้ว");
      } else {
        alert(error.message);
      }
    }
  };

  // ล็อกอิน
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("เข้าสู่ระบบสำเร็จ!");
      setIsLoggedIn(true); // ✅ ให้เข้าใช้งาน App ได้
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("รหัสผ่านไม่ถูกต้อง");
      } else if (error.code === "auth/user-not-found") {
        alert("ไม่พบผู้ใช้");
      } else {
        alert(error.message);
      }
    }
  };

  // ปุ่มเปิดปิด ส่งค่าไป Realtime Database
  const handleClick = (value) => {
    setState(value);
    set(ref(db, "switches/switch1"), value);
  };

  // ------------------ UI ------------------
  if (!isLoggedIn) {
    // ถ้ายังไม่ login → แสดง Register / Login form
    return (
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        {isRegister ? (
          <>
            <h2>Register</h2>
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="ID Card (13 digits)"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <button onClick={handleRegister}>Register</button>
            <br />
            <br />
            <p>
              มีบัญชีแล้ว?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setIsRegister(false)}
              >
                Login ที่นี่
              </span>
            </p>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <button onClick={handleLogin}>Login</button>
            <br />
            <br />
            <p>
              ยังไม่มีบัญชี?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setIsRegister(true)}
              >
                Register ที่นี่
              </span>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Control Switch</h2>
      <button onClick={() => handleClick(1)}>เปิด</button>
      <button onClick={() => handleClick(0)}>ปิด</button>
      <p>สถานะปัจจุบัน: {state}</p>
    </div>
  );
}

export default MainPage;
