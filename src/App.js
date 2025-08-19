import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(true); // true = Register, false = Login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [idCard, setIdCard] = useState("");

  const handleRegister = async () => {
    try {
      // ตรวจสอบเลขบัตรประชาชน 13 หลัก
      if (!/^\d{13}$/.test(idCard)) {
        alert("เลขบัตรประชาชนต้องมี 13 หลัก");
        return;
      }

      // สมัครสมาชิก
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // บันทึกข้อมูลเพิ่มเติมลง Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        phone,
        idCard,
        email,
        createdAt: new Date()
      });

      alert("สมัครสมาชิกสำเร็จ!");
      // สลับไปหน้า Login อัตโนมัติ
      setIsRegister(false);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("อีเมลนี้ถูกใช้สมัครไปแล้ว");
      } else {
        alert(error.message);
      }
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("เข้าสู่ระบบสำเร็จ!");
      // สามารถเพิ่ม Redirect ไปหน้า Dashboard หรือหน้าอื่นได้
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

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      {isRegister ? (
        <>
          <h2>Register</h2>
          <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} /><br /><br />
          <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} /><br /><br />
          <input placeholder="ID Card (13 digits)" value={idCard} onChange={(e) => setIdCard(e.target.value)} /><br /><br />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
          <button onClick={handleRegister}>Register</button><br /><br />
          <p>มีบัญชีแล้ว? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsRegister(false)}>Login ที่นี่</span></p>
        </>
      ) : (
        <>
          <h2>Login</h2>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
          <button onClick={handleLogin}>Login</button><br /><br />
          <p>ยังไม่มีบัญชี? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsRegister(true)}>Register ที่นี่</span></p>
        </>
      )}
    </div>
  );
}

export default AuthPage;
