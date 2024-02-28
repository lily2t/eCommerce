class MembershipService {
    constructor(db) {
        this.Membership = db.Membership;
    }

    async getAllMemberships() {
        return this.Membership.findAll();
    }

    async createMembership(membershipDetails) {
        return this.Membership.create(membershipDetails);
    }

    async updateMembership(membershipId, newMembershipDetails) {
        const existingMembership = await this.Membership.findByPk(membershipId);

        if (!existingMembership) {
            throw new Error("Membership not found");
        }

        await existingMembership.update(newMembershipDetails);
        return this.getMembershipById(membershipId);
    }

    async getMembershipById(membershipId) {
        return this.Membership.findByPk(membershipId);
    }

    async deleteMembership(membershipId) {
        const deletedRowCount = await this.Membership.destroy({ where: { id: membershipId } });
        if (deletedRowCount === 0) {
            throw new Error("Membership not found");
        }
    }
}

module.exports = MembershipService;
