'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getBlockTypeById } from '@/services/blockType';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 *
 * @param {string} id
 * @returns single blockType
 */
export const getBlockTypeByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const checkedRole = await checkRole(session, id);
    if (checkedRole && checkedRole.error) return { error: checkedRole.error, status: checkedRole.status };

    return { blockType: JSON.parse(JSON.stringify(checkedRole.b)), status: 200 };
  });
};

/**
 * check role
 *
 * @param {object} session
 * @param {string} id
 */
const checkRole = async (session: any, id: string) => {
  return tryCatch(async () => {
    let b;
    b = await getBlockTypeById(id);
    switch (session.user.role) {
      case 'ADMIN':
        break;
      case 'SUPER ADMIN':
        break;
      case 'DEAN':
        const p = await getDeanProfileByUserId(session.user._id);
        if (b?.courseId?._id.toString() !== p?.courseId?._id.toString()) return { error: 'Forbidden', status: 403 };
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    if (!b) return { error: 'Not found.', status: 404 };
    return { b, status: 200 };
  });
};
