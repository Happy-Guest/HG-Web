<script>
import { h, defineComponent } from "vue";

export default defineComponent({
    name: "BaseButtons",
    props: {
        noWrap: Boolean,
        type: {
            type: String,
            default: "justify-start",
        },
        classAddon: {
            type: String,
            default: "mr-3 last:mr-0 mb-3",
        },
        noMargin: {
            type: Boolean,
            default: false,
        },
        mb: {
            type: String,
            default: "-mb-3",
        },
    },
    render() {
        const hasSlot = this.$slots && this.$slots.default;

        const parentClass = [
            "flex",
            this.noMargin ? "items-end justify-end" : "items-center",
            this.type,
            this.noWrap ? "flex-nowrap" : "flex-wrap",
        ];

        if (this.mb) {
            parentClass.push(this.mb);
        }

        return h(
            "div",
            { class: parentClass },
            hasSlot
                ? this.$slots.default().map((element) => {
                      if (
                          element &&
                          element.children &&
                          typeof element.children === "object"
                      ) {
                          return h(
                              element,
                              {},
                              element.children.map((child) => {
                                  return h(child, {
                                      class: [
                                          this.noMargin
                                              ? "md:mr-3 last:mr-0 mb-3"
                                              : this.classAddon,
                                      ],
                                  });
                              })
                          );
                      }

                      return h(element, {
                          class: [
                              this.noMargin
                                  ? "md:mr-3 last:mr-0 mb-3"
                                  : this.classAddon,
                          ],
                      });
                  })
                : null
        );
    },
});
</script>
