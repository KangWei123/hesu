import { router } from '@/register/member';

import { elderRoute, familyMemberRoute, normalCustomersRoute } from '@/register/kangyang';
router.addRoutes([familyMemberRoute.route, elderRoute.route, normalCustomersRoute.route]);

export default router;
