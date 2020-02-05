import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Home from "@/components/home/Home.vue";

describe("Home.vue", () => {
  it("renders props.msg when passed", () => {
    const replicant = "Roy Batty";
    const wrapper = shallowMount(Home, {
      propsData: { replicant }
    });
    expect(wrapper.text()).to.include(replicant);
  });
});
