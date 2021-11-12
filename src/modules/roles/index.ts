import { Role } from '../../../generated/schema'

export namespace roles {

    export function getOrCreateRole(role: string): Role {
        let roleInstance = Role.load(role)

        if (roleInstance == null) {
            roleInstance = new Role(role)
            roleInstance.revoked = false
        }
        
        return roleInstance as Role
    }
}