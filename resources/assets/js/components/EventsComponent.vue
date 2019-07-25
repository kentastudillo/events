<template>
  <div class="container-fluid p-5">
    <div class="row">
      <div class="col-12 col-lg-3 col-xl-3">
        <div class="card rounded-lg">
          <div class="card-body">
            <h3>Event</h3>

            <form v-on:submit.prevent="saveEvent()">
              <div class="row">
                <div class="col-12 form-group">
                  <label class="control-label">Name</label>
                  <input type="text" v-model="event.name" class="form-control" required />
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label class="control-label">From</label>
                  <input
                    type="text"
                    v-model="event.startDate"
                    class="form-control"
                    id="from-datepicker-trigger"
                    autocomplete="false"
                    readonly
                    required
                  />
                  <AirbnbStyleDatepicker
                    :trigger-element-id="'from-datepicker-trigger'"
                    :mode="'single'"
                    :months-to-show="1"
                    :fullscreen-mobile="true"
                    :min-date="calendarMinDate"
                    :end-date="calendarMaxDate"
                    :date-one="event.startDate"
                    @date-one-selected="val => {
                      if (val > event.endDate && event.endDate) {
                        event.endDate = val;
                      }

                      event.startDate = val;
                    }"
                  />
                </div>
                <div class="col-6 form-group">
                  <label class="control-label">To</label>
                  <input
                    type="text"
                    v-model="event.endDate"
                    class="form-control"
                    id="to-datepicker-trigger"
                    autocomplete="false"
                    readonly
                    required
                  />
                  <AirbnbStyleDatepicker
                    :trigger-element-id="'to-datepicker-trigger'"
                    :mode="'single'"
                    :months-to-show="1"
                    :fullscreen-mobile="true"
                    :date-one="event.endDate"
                    :min-date="event.startDate"
                    :end-date="calendarMaxDate"
                    @date-one-selected="val => { event.endDate = val }"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label class="control-label">Days</label>
                  <div class="form-check" v-for="day in days" v-bind:key="day">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="event.days"
                      :value="day"
                      :id="day"
                      :disabled="isDayDisabled(day)"
                    />
                    <label class="form-check-label" :for="day">{{ day }}</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <button
                    class="btn btn-primary"
                    :disabled="event.days.length === 0"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-9 col-xl-9 mt-5 mt-lg-0 mt-xl-0">
        <div class="card rounded-lg">
          <div class="card-body">
            <h3 class="text-center mb-3">{{ currentMonthName }}</h3>

            <div
              class="d-flex flex-row mb-3"
            >
              <div class="text-gray p-2">
                DATE
              </div>

              <div class="text-gray p-2 ml-2">
                EVENTS
              </div>
            </div>

            <div
              class="d-flex flex-row mb-3 date-component"
              v-for="key in Object.keys(daysOfTheMonth)"
              v-bind:key="`day-${key}`"
            >
              <div class="d-flex flex-column align-items-center p-2 w-50p">
                <h4 class="mb-0">{{ daysOfTheMonth[key].day }}</h4>
                <p class="text-gray">{{ daysOfTheMonth[key].dayName }}</p>
              </div>

              <div class="d-flex flex-column flex-grow-1 ml-2">
                <div
                  class="p-2 mb-2 rounded-lg text-white"
                  v-for="event in daysOfTheMonth[key].events"
                  v-bind:style="{ backgroundColor: event.color }"
                  v-bind:key="event.id"
                >
                  {{ event.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { format, eachDay, startOfMonth, endOfMonth } from 'date-fns';

  const colors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#00BCD4',
    '#4CAF50',
    '#FFC107',
    '#795548',
    '#607D8B',
    '#FFCCBC'
  ];

  export default {
    mounted() {
      this.fetchEvents();
      this.$swal('Success!', 'Event has been saved', 'success');
    },
    data: function() {
      const startDateOfMonth = startOfMonth(new Date());
      const endDateOfMonth = endOfMonth(new Date());
      const daysOfTheMonth = eachDay(startDateOfMonth, endDateOfMonth);
      const data = {};

      daysOfTheMonth.forEach((day) => {
        data[format(day, 'YYYY-MM-DD')] = {
          day: format(day, 'D'),
          dayName: format(day, 'ddd'),
          events: []
        };
      });

      return {
        events: [],
        event: {
          name: "",
          startDate: "",
          endDate: "",
          days: []
        },
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        daysOfTheMonth: data,
        currentMonthName: format(new Date(), 'MMMM YYYY'),
        calendarMinDate: startDateOfMonth,
        calendarMaxDate: endDateOfMonth
      };
    },
    methods: {
      handleSelectDay(event) {
        const name = event.target.name;
        const { days } = this.event;

        if (event.target.checked && days.indexOf(name) === -1) {
          days.push(name);
        } else if (!event.target.checked && days.indexOf(name) > -1) {
          days.splice(days.indexOf(name));
        }
      },
      isDayDisabled(day) {
        const { startDate, endDate } = this.event;
        const days = [];

        if (startDate && endDate) {
          const dates = eachDay(startDate, endDate);

          dates.forEach((d) => {
            days.push(format(d, 'ddd'));
          });
        }

        return days.indexOf(day) === -1;
      },
      addEventsToCalendar(events) {
        const self = this;

        events.forEach((event) => {
          const eventDates = eachDay(event.start_date, event.end_date);
          // Get a random color for background
          event.color = colors[Math.floor(Math.random() * colors.length) + 1];

          eventDates.forEach((date) => {
            const dateString = format(date, 'YYYY-MM-DD');
            const dateDayName = format(date, 'ddd');

            if (self.daysOfTheMonth[dateString] && event.days.indexOf(dateDayName) > -1) {
              self.daysOfTheMonth[dateString].events.push(event);
            }
          });
        });
      },
      fetchEvents() {
        axios
          .get('/api/v1/events')
          .then((response) => {
            const { data } = response;

            this.addEventsToCalendar(data);
          })
          .catch((error) => {
            console.log(`Error: ${error}`);

            this.$swal('Oops!', 'Something went wrong.', 'error');
          });
      },
      saveEvent() {
        const { event } = this;

        axios
          .post(
            "/api/v1/events",
            JSON.stringify({
              name: event.name,
              start_date: event.startDate,
              end_date: event.endDate,
              days: event.days
            }),
            {
              headers: { 'Content-Type': 'application/json' }
            }
          )
          .then((response) => {
            const { data } = response;

            // Clear event
            Object.keys(event).forEach((key) => {
              self.event[key] = key == 'days' ? [] : '';
            });

            this.$swal('Success!', 'Event has been saved', 'success');

            this.addEventsToCalendar([data]);
          })
          .catch((error) => {
            console.log(`Error: ${error}`);

            this.$swal('Oops!', 'Something went wrong.', 'error');
          });
      }
    }
  };
</script>
