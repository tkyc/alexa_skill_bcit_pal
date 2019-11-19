const constants = {
    //Room ID maps to the index in the rooms array in the schedule.json file
    //Need whitespace for cases where slot value has whitespace
    roomMap: {
        "130D": 0,
        "130E": 1,
        "130F": 2,
        "130G": 3,
        "130H": 4,
        "130I": 5,
        "137": 6,
        "138": 7,
        "140": 8,
        "141": 9,
        "312": 10,
        "130 D": 0,
        "130 E": 1,
        "130 F": 2,
        "130 G": 3,
        "130 H": 4,
        "130 I": 5,
    },

    //Course name maps to the index of the course in the exam_schedule.json file
    courseMap: {
        "math3042": 0,
        "comp4968": 1,
        "comp4964": 2,
        "comp4711": 3,
        "B. law3600": 4,
        "comp4735": 5
    }
};

module.exports = constants;
