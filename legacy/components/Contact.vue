<template>
  <section
    class="row contact-row"
    :id="path.resolve.split('#').join('')"
    ref="contact"
  >
    <div
      class="contact-bg"
      v-if="p_apply_bg"
      :style="{ 'background-image': `url(${p_apply_bg})` }"
    ></div>

    <CurrentStep
      v-if="p_step_indicator"
      :append="currentStep"
      class="prevent-w-100"
    ></CurrentStep>

    <div class="row-inner">
      <div class="contact-content" :class="{ 'bg-applied': p_apply_bg }">
        <header data-scrollbreak="150" class="contact-header-text">
          <span>{{ getContactHeaderText() }}</span>
        </header>
        <p data-scrollbreak="550" class="contact-subheader-text">
          nous pouvons parler de ton projet "amazing" autour d'un café.
        </p>

        <div data-scrollbreak="350" class="contact-form-wrapper">
          <form @submit.prevent.stop="sendMail" class="contact-form">
            <div class="contact-form-group">
              <input
                v-model="message.fullName"
                @blur="inputLeft($event)"
                name="name"
                tabindex="1"
                type="text"
                required
                placeholder="comment je peux t'appeler ?"
                class="contact-form-field"
              />
            </div>

            <div class="contact-form-group">
              <input
                v-model="message.email"
                @blur="inputLeft($event)"
                name="email"
                tabindex="2"
                type="email"
                required
                placeholder="renseigne ton adresse email"
                class="contact-form-field"
              />
            </div>

            <div class="contact-form-group">
              <textarea
                @blur="inputLeft($event)"
                v-model="message.messageBody"
                required
                tabindex="3"
                placeholder="alors, dis-moi"
                rows="6"
                class="contact-form-field"
              />
            </div>

            <h6 v-if="mailSent" class="message-sent">
              Et voilà le facteur est passé prendre l'enveloppe.
            </h6>

            <div class="contact-form-group contact-form-btn-wrapper">
              <button
                :class="{ loading: sendingMail }"
                name="send"
                tabindex="4"
                type="submit"
                class="btn"
                title="Say hello"
              >
                Hello
              </button>

              <div class="contact-social">
                <SocialLinks />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import $ from "jquery";
import { mapGetters } from "vuex";
import {
  APP_NAME,
  PATHS,
  FLEXMAILER_API_HOST,
  BLOG_URL
} from "@@/illuminate/config";
import { animateElements, ajaxPost } from "@@/illuminate/utils";
import CurrentStep from "@/components/CurrentStep";
import SocialLinks from "@/components/SocialLinks";

export default {
  name: "Contact",

  // Required components
  components: { CurrentStep, SocialLinks },

  // Props
  props: {
    // Restricted
    p_step_indicator: { type: Boolean, default: true, required: false },

    // Background
    p_apply_bg: { type: String, default: "", required: false }
  },

  // Data
  data: () => ({
    // currentStep
    currentStep: {
      text: "me contacter"
    },

    // My path
    path: PATHS.CONTACT,

    // BLOG_URL
    BLOG_URL: BLOG_URL,

    // Message
    message: {
      fullName: ``,
      email: ``,
      messageBody: ``
    },

    // sendingMail
    sendingMail: false,

    // mailSent
    mailSent: false
  }),

  // computed
  computed: {
    ...mapGetters({
      // Current visible section's path
      x_current_path: "app/current_path"
    })
  },

  // watch
  watch: {
    // x_current_path
    x_current_path(val) {
      if (val === this.path.resolve) {
        animateElements(this.$refs["contact"]);
      }
    }
  },

  // Methods
  methods: {
    // inputLeft
    inputLeft(e) {
      $(e.target).removeClass("dirty");

      if ($(e.target).val() !== "") {
        $(e.target).addClass("dirty");
      }
    },

    // sendMail
    sendMail() {
      this.sendingMail = true;

      // Send request
      ajaxPost(FLEXMAILER_API_HOST, {
        fullName: this.message.fullName,
        email: this.message.email,
        messageBody: this.message.messageBody,
        to: `akakpo.jeanjacques@gmail.com`,
        subject: `${this.message.fullName} a visité ${APP_NAME}`
      }).then(response => {
        this.sendingMail = false;
        this.mailSent = true;
      });
    },

    // getContactHeaderText
    getContactHeaderText() {
      return "on se donne rendez-vous ?";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/contact.scss";
</style>
