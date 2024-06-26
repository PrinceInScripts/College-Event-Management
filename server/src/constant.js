export const DB_NAME="collage-event-data"

export const userRolesEnum={
    ADMIN:"ADMIN",
    STUDENT:"STUDENT",
    STAFF:"STAFF"
}

export const AvailableUserRoles=Object.values(userRolesEnum)


export const userGenderEnum={
    MALE:"MALE",
    FEMALE:"FEMALE",
    OTHER:"OTHER"
}

export const AvailableUserGenderEnum=Object.values(userGenderEnum)

export const eventTypeEnum={
    CONFERENCE:"CONFERENCE",
    SEMINAR:"SEMINAR",
    WORKSHOP:"WORKSHOP",
    TRAINING:"TRAINING",
    CONCERT:"CONCERT",
    EXHIBITION:"EXHIBITION",
    WEBINAR:"WEBINAR",
    NETWORKING:"NETWORKING",
    CHARITY:"CHARITY",
    SPORTS:"SPORTS"
}

export const AvailableEventTypeEnum=Object.values(eventTypeEnum)


export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;
export const MAXIMUM_SUB_IMAGE_COUNT = 4;
