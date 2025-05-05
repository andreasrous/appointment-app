import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

export const getBusinessById = async (id: string) => {
  try {
    const business = await db.business.findUnique({ where: { id } });
    return business;
  } catch {
    return null;
  }
};

export const getBusinessByOwnerId = async (ownerId: string) => {
  try {
    const business = await db.business.findUnique({ where: { ownerId } });
    return business;
  } catch {
    return null;
  }
};

export const getBusinessNameById = async (id: string) => {
  try {
    const business = await db.business.findUnique({
      where: { id },
      select: { name: true },
    });

    return business?.name;
  } catch {
    return null;
  }
};

export const getAllBusinesses = async () => {
  try {
    const user = await getCurrentUser();

    const businesses = await db.business.findMany({
      include: {
        favoritedBy: {
          where: {
            userId: user?.id,
          },
          select: { id: true },
        },
      },
    });

    return businesses.map((business) => ({
      ...business,
      isFavorited: business.favoritedBy.length > 0,
    }));
  } catch {
    return null;
  }
};

export const getAllOtherBusinesses = async () => {
  try {
    const user = await getCurrentUser();

    const userConversationMemberships = await db.conversationMember.findMany({
      where: {
        memberId: user?.id,
      },
      select: {
        conversationId: true,
      },
    });

    const userConversationIds = userConversationMemberships.map(
      (m) => m.conversationId
    );

    const conversationsWithBusinesses = await db.conversation.findMany({
      where: {
        id: {
          in: userConversationIds,
        },
      },
      include: {
        members: {
          include: {
            member: {
              select: {
                id: true,
                business: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    const businessIdsInConversation = new Set<string>();
    for (const conversation of conversationsWithBusinesses) {
      for (const member of conversation.members) {
        const businessId = member.member.business?.id;
        if (businessId && member.member.id !== user?.id) {
          businessIdsInConversation.add(businessId);
        }
      }
    }

    const businesses = await db.business.findMany({
      where: {
        ownerId: {
          not: user?.id,
        },
        id: {
          notIn: Array.from(businessIdsInConversation),
        },
      },
    });

    return businesses;
  } catch {
    return [];
  }
};

export const getFavoriteBusinesses = async () => {
  const user = await getCurrentUser();

  const favorites = await db.favorite.findMany({
    where: { userId: user?.id },
    include: {
      business: true,
    },
  });

  return favorites.map((fav) => ({
    ...fav.business,
    isFavorited: true,
  }));
};
