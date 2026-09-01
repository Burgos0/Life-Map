export const getInitialData = () => {
  return {
    school: {
      id: 'school-root',
      name: 'School',
      type: 'Area',
      priority: 4,
      status: 'In Progress',
      notes: 'Academic work and learning',
      children: [
        {
          id: 'ee301-1',
          name: 'EE 301',
          type: 'Project',
          priority: 4,
          status: 'In Progress',
          notes: 'Circuit design course',
          children: [
            {
              id: 'ee301-hw-1',
              name: 'Homework',
              type: 'Task',
              priority: 3,
              status: 'Not Started',
              notes: '',
              children: []
            },
            {
              id: 'ee301-study-1',
              name: 'Study for midterm',
              type: 'Task',
              priority: 4,
              status: 'In Progress',
              notes: 'Chapter 1-5, focus on transformers',
              children: []
            }
          ]
        }
      ]
    },
    car: {
      id: 'car-root',
      name: 'Car',
      type: 'Area',
      priority: 3,
      status: 'In Progress',
      notes: 'Vehicle projects and maintenance',
      children: [
        {
          id: 'g35-1',
          name: 'G35',
          type: 'Project',
          priority: 4,
          status: 'In Progress',
          notes: 'Daily driver modification',
          children: [
            {
              id: 'g35-supercharger-1',
              name: 'Supercharger',
              type: 'Project',
              priority: 4,
              status: 'Waiting',
              notes: 'Parts ordered, waiting for arrival',
              children: [
                {
                  id: 'g35-sc-injectors-1',
                  name: 'Install injectors',
                  type: 'Task',
                  priority: 4,
                  status: 'Not Started',
                  notes: '',
                  children: []
                },
                {
                  id: 'g35-sc-fuel-1',
                  name: 'Install fuel pump',
                  type: 'Task',
                  priority: 4,
                  status: 'Not Started',
                  notes: '',
                  children: []
                }
              ]
            },
            {
              id: 'g35-maintenance-1',
              name: 'Maintenance',
              type: 'Project',
              priority: 2,
              status: 'Waiting',
              notes: '',
              children: [
                {
                  id: 'g35-oil-1',
                  name: 'Oil change',
                  type: 'Task',
                  priority: 3,
                  status: 'Not Started',
                  notes: 'Due in 2000 miles',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    money: {
      id: 'money-root',
      name: 'Money',
      type: 'Area',
      priority: 5,
      status: 'In Progress',
      notes: 'Financial management and goals',
      children: [
        {
          id: 'bills-1',
          name: 'Bills',
          type: 'Project',
          priority: 5,
          status: 'In Progress',
          notes: 'Monthly recurring bills',
          children: []
        },
        {
          id: 'savings-1',
          name: 'Savings',
          type: 'Project',
          priority: 4,
          status: 'In Progress',
          notes: 'Emergency fund and goals',
          children: []
        }
      ]
    },
    ideas: []
  }
}
