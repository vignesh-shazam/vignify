import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import AdminLoginForm from "./login-form";
export default async function AdminLoginPage(){const {user,isAdmin}=await getAdminSession();if(user&&isAdmin)redirect('/admin');return <AdminLoginForm/>}
