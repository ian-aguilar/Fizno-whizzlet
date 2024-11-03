import userRoute from "../module/user.template/user.routes";
import adminRoute from "../module/admin.template/admin.routes";
import authRoute from "../module/auth.template/auth.routes";

const router = [
  {
    prefix: "/auth",
    router: authRoute,
  },
  {
    prefix: "/admin",
    router: adminRoute,
  },
  {
    prefix: "/user",
    router: userRoute,
  },
];

export default router;
