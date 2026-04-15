import { redirect } from 'next/navigation';

/** 旧パス互換: 顧客管理は `/admin/customers` に集約（従業員用画面は別途） */
export default function AdminUsersRedirectPage() {
  redirect('/admin/customers');
}
