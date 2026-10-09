 import { gql } from '@apollo/client';

export const CREATE_TRAVEL_PLAN = gql`
  mutation CreateTravelPlan(
    $input: CreateTravelPlanInput!
  ) {
    createTravelPlan(input: $input) {
      id
      userId
      title
      destination
      input
      content
      status
      createdAt
      updatedAt

      items {
        id
        travelPlanId
        dayIndex
        timeSlot
        activityName
        locationId
        description
        costEstimate
      }
    }
  }
`;

export const GET_TRAVEL_PLAN = gql`
  query TravelPlan(
    $id: ID!
  ) {
    travelPlan(id: $id) {
      id
      userId
      title
      destination
      input
      content
      status
      createdAt
      updatedAt

      items {
        id
        travelPlanId
        dayIndex
        timeSlot
        activityName
        locationId
        description
        costEstimate
      }
    }
  }
`;

export const GET_TRAVEL_PLANS = gql`
  query TravelPlans(
    $pagination: PaginationInput!
  ) {
    travelPlans(
      pagination: $pagination
    ) {
      items {
        id
        userId
        title
        destination
        input
        content
        status
        createdAt
        updatedAt

        items {
          id
          travelPlanId
          dayIndex
          timeSlot
          activityName
          locationId
          description
          costEstimate
        }
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const UPDATE_TRAVEL_PLAN = gql`
  mutation UpdateTravelPlan(
    $input: UpdateTravelPlanInput!
  ) {
    updateTravelPlan(input: $input) {
      id
      userId
      title
      destination
      input
      content
      status
      createdAt
      updatedAt

      items {
        id
        travelPlanId
        dayIndex
        timeSlot
        activityName
        locationId
        description
        costEstimate
      }
    }
  }
`;

export const DELETE_TRAVEL_PLAN = gql`
  mutation DeleteTravelPlan(
    $id: ID!
  ) {
    deleteTravelPlan(id: $id)
  }
`;

