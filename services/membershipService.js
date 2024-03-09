class MembershipService {
    constructor(db) {
        this.Membership = db.Membership;
        this.User = db.User;
    }

    async createMembership(name, discount_percentage, min_items, max_items) {
        return this.Membership.create({ name, discount_percentage, min_items, max_items });
    }

    async getAllMemberships() {
        return this.Membership.findAll();
    }

    async updateMembership(membershipId, updatedFields) {
        const membership = await this.Membership.findByPk(membershipId);
        if (!membership) {
            throw new Error("Membership not found");
        }
        await membership.update(updatedFields);
        return membership;
    }

    async deleteMembership(membershipId) {
        const membership = await this.Membership.findByPk(membershipId);
        if (!membership) {
            throw new Error("Membership not found");
        }

        const usersWithMembership = await this.User.findAll({
            where: {
                MembershipId: membershipId
            }
        });
        if (usersWithMembership.length > 0) {
            throw new Error("Membership is assigned to a user and cannot be deleted");
        }

        await membership.destroy();
        return membership;
    }
}

module.exports = MembershipService;
